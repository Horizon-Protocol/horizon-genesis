import { useMemo } from "react";
import { useQuery } from "react-query";
import { useUpdateAtom } from "jotai/utils";
import { flatten } from "lodash";
import { BigNumber } from "ethers";
import { Call, Contract } from "@horizon-protocol/ethcall";
import AbiErc20 from "@contracts/abis/Erc20.json";
import AbiHZN from "@contracts/abis/HZN.json";
import AbiVyper from "@contracts/abis/Vyper_contract.json";
import AbiStaking from "@contracts/abis/Staking.json";
import type { Erc20 } from "@contracts/typings/Erc20";
import type { Staking } from "@contracts/typings/Staking";
import { HZN, Vyper } from "@contracts/typings";
import useWallet from "@hooks/useWallet";
import { Farms, farmsAtom, FarmConf, FarmData } from "@atoms/staker/farm";
import { CONTRACT } from "@utils/queryKeys";
import { etherToBN, zeroBN } from "@utils/number";
import { Token } from "@utils/constants";
import useAddresses from "./useAddresses";
import useGetEthCallProvider from "./useGetEthCallProvider";

export default function useFetchFarms() {
  const { account } = useWallet();
  const setFarms = useUpdateAtom(farmsAtom);
  const addressMap = useAddresses();

  const farms = useMemo<FarmConf[]>(() => {
    if (addressMap) {
      return Farms.map((farm) => {
        if (farm.name === Token.HZN_BNB_LP) {
          return {
            ...farm,
            token1: addressMap.HZN,
          };
        }
        if (farm.name === Token.ZUSD_BUSD_LP) {
          return {
            ...farm,
            token1: addressMap.zUSD,
          };
        }
        if (farm.name === Token.HZN_BNB_LP_LEGACY) {
          return {
            ...farm,
            token1: addressMap.HZN,
          };
        }
        return farm;
      });
    }
    return Farms;
  }, [addressMap]);

  const getProvider = useGetEthCallProvider();

  useQuery(
    [CONTRACT, "farms", account, farms],
    async () => {
      const ethcallProvider = await getProvider();
      const farmCallsList = farms.map((farm) => getFarmCalls(farm, account));
      const flatCalls = flatten(farmCallsList);
      const callResults = await ethcallProvider.all<BigNumber>(flatCalls);

      const results: FarmData[] = [];
      const now = Date.now() / 1000;

      let start = 0;
      farms.forEach((farm, index) => {
        const farmCalls = farmCallsList[index];
        const farmResults = callResults.slice(start, start + farmCalls.length);
        start = start + farmCalls.length;
        const [periodFinish, lockDownDuration, ...otherVals] = farmResults;
        const finishTimestamp = periodFinish.toNumber();
        const otherValsBN = otherVals.map(etherToBN);
        const formattedVals = otherVals.map(etherToBN).map((v) => v.toNumber());

        let i = 0;
        const item: FarmData = {
          name: farm.name,
          token0Name: farm.token0Name,
          token1Name: farm.token1Name,
          isRoundActive: finishTimestamp > 0 && now < finishTimestamp,
          lockDownSeconds: lockDownDuration.toNumber(),
          rewards: formattedVals[i++],
          rewardsPerSecond: formattedVals[i++],
          totalStaked: formattedVals[i++],
          total: formattedVals[i++],
          token0Balance: 0,
          token1Balance: 0,
          available: zeroBN,
          allowance: undefined,
          withdrawable: zeroBN,
          staked: 0,
          earned: 0,
        };
        if (farm.token0 && farm.token1) {
          item.token0Balance = formattedVals[i++];
          item.token1Balance = formattedVals[i++];
        }
        if (account) {
          item.available = otherValsBN[i++];
          item.allowance = otherValsBN[i++];
          item.withdrawable = otherValsBN[i++];
          item.staked = formattedVals[i++];
          item.earned = formattedVals[i++];
        }
        results.push(item);
      });

      return results;
    },
    {
      onSuccess(farmsData) {
        setFarms(farmsData);
      },
    }
  );
}

function getFarmCalls(farm: FarmConf, account: string): Call[] {
  const lpContract: HZN =
    farm.name === Token.HZN
      ? (new Contract(farm.address, AbiHZN) as unknown as HZN)
      : (new Contract(farm.address, AbiErc20) as unknown as HZN);
  const stakingContract = new Contract(
    farm.staking,
    AbiStaking
  ) as unknown as Staking;

  const availableFunc =
    farm.name === Token.HZN ? "transferableSynthetix" : "balanceOf";
  const calls = [
    stakingContract.periodFinish(), // finish time
    stakingContract.lockDownDuration(), // lockDownDuration in seconds
    stakingContract.getRewardForDuration(),
    stakingContract.rewardRate(),
    stakingContract.totalSupply(),
    lpContract.totalSupply(),
  ];

  if (farm.token0 && farm.token1) {
    let token0Contract;
    let token1Contract;
    if(farm.name === Token.ZBNB_BNB_LP) {
      token0Contract = new Contract(
        farm.token0,
        AbiVyper
      ) as unknown as Vyper;
      token1Contract = new Contract(
        farm.token0,
        AbiVyper
      ) as unknown as Vyper;
      calls.push(
        token0Contract?.balances(0),
        token1Contract?.balances(1)
      );
    } else {
      token0Contract = new Contract(
        farm.token0,
        AbiErc20
      ) as unknown as Erc20;
      token1Contract = new Contract(
        farm.token1,
        AbiErc20
      ) as unknown as Erc20;
      calls.push(
        token0Contract?.balanceOf(farm.address),
        token1Contract?.balanceOf(farm.address)
      );
    }
  }

  if (account) {
    calls.push(
      lpContract[availableFunc](account),
      lpContract.allowance(account, farm.staking),
      stakingContract.withdrawableAmount(account), // user withdrawable Amount
      stakingContract.balanceOf(account), // user staked
      stakingContract.earned(account) // user staked
    );
  }
  
  return calls as unknown as Call[];
}
