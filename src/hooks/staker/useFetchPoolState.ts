import { useCallback } from "react";
import { useQuery } from "react-query";
import { BigNumber } from "ethers";
import { useUpdateAtom } from "jotai/utils";
import { Erc20, HZN, Staking } from "@abis/types";
import erc20Abi from "@abis/erc20.json";
import hznAbi from "@abis/HZN.json";
import StakingAbi from "@abis/staking.json";
import {
  BSC_BLOCK_TIME,
  StakingAddresses,
  Token,
  TokenAddresses,
} from "@utils/constants";
import { etherToBN } from "@utils/number";
import { EARN } from "@utils/queryKeys";
import useDisconnected from "@hooks/useDisconnected";
import {
  poolStateAtomFamily,
  resetPoolStateAtomFamily,
} from "@atoms/staker/pool";
import useWallet from "../useWallet";
import useMultiCall, { useMultiCallContract } from "../useMultiCall";

export default function useFetchState(token: TokenEnum) {
  const { account } = useWallet();

  const getMultiCallProvider = useMultiCall();
  const stakingContract = useMultiCallContract<Staking>(
    StakingAddresses[token],
    StakingAbi
  );
  const tokenContract = useMultiCallContract<Erc20 & HZN>(
    TokenAddresses[token],
    token === Token.HZN ? hznAbi : erc20Abi
  );

  // available atoms
  const setPoolData = useUpdateAtom(poolStateAtomFamily(token));
  const resetPoolData = useUpdateAtom(resetPoolStateAtomFamily(token));

  useDisconnected(resetPoolData);

  const staticFetcher = useCallback(async () => {
    if (tokenContract && stakingContract) {
      const multiCallProvider = await getMultiCallProvider();

      const [
        totalStaked,
        periodFinish,
        rewardsPerSecond,
        lockDownSeconds,
        totalSupply,
      ] = (await multiCallProvider.all([
        // staking contract
        stakingContract.totalSupply(), // total staked
        stakingContract.periodFinish(), // finish time
        stakingContract.rewardRate(), // rewards per second
        // stakingContract.rewardsDuration(), // rewardDuration in seconds
        // token contract
        stakingContract.lockDownDuration(), // lockDownDuration in seconds
        tokenContract.totalSupply(),
      ])) as BigNumber[];

      // console.log("static", token, {
      //   totalStaked: etherToBN(totalStaked).toNumber(),
      //   periodFinish: periodFinish.toNumber(),
      //   rewardsPerBlock: etherToBN(rewardsPerSecond)
      //     .multipliedBy(BSC_BLOCK_TIME)
      //     .toNumber(),
      //   lockDownSeconds: lockDownSeconds.toNumber(),
      //   totalSupply: etherToBN(totalSupply).toNumber(),
      // });

      const finishTimestamp = periodFinish.toNumber();
      const now = Date.now() / 1000;
      setPoolData({
        isRoundActive: finishTimestamp > 0 && now < finishTimestamp,
        totalStaked: etherToBN(totalStaked),
        lockDownSeconds: lockDownSeconds.toNumber(),
        rewardsPerBlock:
          etherToBN(rewardsPerSecond).multipliedBy(BSC_BLOCK_TIME),
        totalSupply: etherToBN(totalSupply),
      });
    }
  }, [getMultiCallProvider, setPoolData, stakingContract, tokenContract]);

  const accountFetcher = useCallback(async () => {
    if (account && tokenContract && stakingContract) {
      const multiCallProvider = await getMultiCallProvider();

      const availableFunc =
        token === Token.HZN ? "transferableSynthetix" : "balanceOf";
      const res = (await multiCallProvider.all([
        tokenContract[availableFunc](account),
        stakingContract.balanceOf(account), // user staked
        stakingContract.earned(account), // user staked
        stakingContract.withdrawableAmount(account), // user withdrawable Amount
      ])) as BigNumber[];

      const [available, staked, earned, withdrawable] = res.map(etherToBN);

      console.log("account", token, {
        available: available.toNumber(),
        staked: staked.toNumber(),
        earned: earned.toNumber(),
        withdrawable: withdrawable.toNumber(),
      });

      setPoolData({
        available,
        staked,
        earned,
        withdrawable,
      });
    }
  }, [
    account,
    getMultiCallProvider,
    setPoolData,
    stakingContract,
    token,
    tokenContract,
  ]);

  useQuery([EARN, account, "pool-static", token], staticFetcher);
  useQuery([EARN, account, "pool-account", token], accountFetcher, {
    enabled: !!account,
  });
}
