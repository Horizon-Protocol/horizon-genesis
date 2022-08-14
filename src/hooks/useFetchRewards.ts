import { useCallback } from "react";
import { useQuery, QueryFunction } from "react-query";
import { useResetAtom, useUpdateAtom } from "jotai/utils";
import { ethers } from "ethers";
import horizon from "@lib/horizon";
import { rewardsAtom, resetAtom } from "@atoms/feePool";
import { CONTRACT } from "@utils/queryKeys";
import { etherToBN, formatNumber, toBN } from "@utils/number";
import useWallet from "./useWallet";
import useDisconnected from "./useDisconnected";

interface Result {
  claimable: boolean;
  exchangeReward: BN;
  stakingReward: BN;
  upcomingExchangeReward: BN;
  upcomingStakingReward: BN;
}

export default function useFetchRewards() {
  const { account } = useWallet();

  const setRewards = useUpdateAtom(rewardsAtom);

  const resetRewards = useResetAtom(resetAtom);

  useDisconnected(resetRewards);

  const fetcher = useCallback<QueryFunction<Result, string[]>>(async () => {
    const {
      contracts: { FeePool },
    } = horizon.js!;

    const [claimable, availableFees, periodFees] = (await Promise.all([
      FeePool.isFeesClaimable(account),
      FeePool.feesAvailable(account),
      FeePool.feesByPeriod(account)
    ])) as [boolean, [ethers.BigNumber, ethers.BigNumber], [[ethers.BigNumber,ethers.BigNumber],[ethers.BigNumber,ethers.BigNumber]]];
    const result =  {
      claimable,
      exchangeReward: etherToBN(availableFees[0]),
      stakingReward: etherToBN(availableFees[1]),
      upcomingExchangeReward: etherToBN(periodFees[0][0]),
      upcomingStakingReward: etherToBN(periodFees[0][1]),
    };
    console.log('periodFees',periodFees)
    console.log('===periodFees',[
      formatNumber(etherToBN(periodFees[0][0])),
      formatNumber(etherToBN(periodFees[0][1])),
      formatNumber(etherToBN(periodFees[1][0])),
      formatNumber(etherToBN(periodFees[1][1])),
    ])
    return result
  }, [account]);

  useQuery([CONTRACT, account, "rewards"], fetcher, {
    enabled: !!account && !!horizon.js,
    onSuccess({ claimable, stakingReward, exchangeReward, upcomingExchangeReward, upcomingStakingReward }) {
      console.log('===useFetchRewards===',{
        claimable:claimable,
        stakingReward:stakingReward.toNumber(),
        exchangeReward:exchangeReward.toNumber(),
        upcomingExchangeReward: upcomingExchangeReward.toNumber(),
        upcomingStakingReward: upcomingStakingReward.toNumber()
      });
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

