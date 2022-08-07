import { useCallback, useMemo } from "react";
import { useQuery, QueryFunction } from "react-query";
import { useResetAtom, useUpdateAtom } from "jotai/utils";
import { ethers } from "ethers";
import horizon from "@lib/horizon";
import { rewardsAtom, resetAtom } from "@atoms/feePool";
import { CONTRACT } from "@utils/queryKeys";
import { etherToBN, formatNumber, toBN } from "@utils/number";
import useWallet from "./useWallet";
import useDisconnected from "./useDisconnected";
import { REFETCH_INTERVAL } from "@utils/constants";
import useHorizonJs from "./useHorizonJs";
import { Contract } from "@horizon-protocol/ethcall";
import useGetEthCallProvider from "./staker/useGetEthCallProvider";

interface Result {
  claimable: boolean;
  exchangeReward: BN;
  stakingReward: BN;
  upcomingExchangeReward: BN;
  upcomingStakingReward: BN;
}

export default function useFetchRewards() {
  const { account } = useWallet();
  const horizonJs = useHorizonJs();
  const getProvider = useGetEthCallProvider();
  const setRewards = useUpdateAtom(rewardsAtom);
  const resetRewards = useResetAtom(resetAtom);
  useDisconnected(resetRewards);

  const contractMap = useMemo(() => {
    if (!horizonJs) {
        return null;
    }
    const { contracts } = horizonJs;
    return {
        FeePool: new Contract(
            contracts.FeePool.address,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            contracts.FeePool.interface.fragments as any
        ),
    };
}, [horizonJs]);

const fetcher = useCallback<QueryFunction>(async () => {
  const mixCalls = [
      contractMap!.FeePool.isFeesClaimable(account),
      contractMap!.FeePool.feesAvailable(account),
      contractMap!.FeePool.feesByPeriod(account)
  ];

  const ethcallProvider = await getProvider();

  const res = (await ethcallProvider.all(mixCalls)) as unknown[];

  const [
      claimable,
      availableFees,
      periodFees
  ] = res as [
      boolean,
      [ethers.BigNumber, ethers.BigNumber],
      [[ethers.BigNumber, ethers.BigNumber], [ethers.BigNumber, ethers.BigNumber]]
  ];
  return [
      claimable,
      etherToBN(availableFees[0]),
      etherToBN(availableFees[1]),
      etherToBN(periodFees[0][0]),
      etherToBN(periodFees[0][1]),
  ]
}, [
  contractMap,
  getProvider,
  account
]);

  useQuery([CONTRACT, account, "rewards"], fetcher, {
    refetchInterval: REFETCH_INTERVAL,
    enabled: !!account && !!horizon.js,
    onSuccess([
      claimable,
      exchangeReward,
      stakingReward,
      upcomingExchangeReward,
      upcomingStakingReward,
  ]){
      // console.log('===claimablestakingRewardexchangeReward',{
      //   claimable:claimable,
      //   stakingReward:stakingReward.toNumber(),
      //   exchangeReward:exchangeReward.toNumber(),
      //   upcomingExchangeReward: upcomingExchangeReward.toNumber(),
      //   upcomingStakingReward: upcomingStakingReward.toNumber()
      // });
      setRewards({
        claimable,
        stakingReward,
        exchangeReward,
        upcomingExchangeReward,
        upcomingStakingReward
      });
    },
  });
}
