import { useCallback } from "react";
import { useQuery, QueryFunction } from "react-query";
import { useUpdateAtom } from "jotai/utils";
import { ethers, utils } from "ethers";
import horizon from "@lib/horizon";
import { currentFeePeriodAtom, previousFeePeriodAtom } from "@atoms/feePool";
import { etherToBN } from "@utils/number";
import { CONTRACT, PUBLIC } from "@utils/queryKeys";

type Period = "0" | "1"; // '0': current; '1': previous

type FeePeriod = {
  startTime: ethers.BigNumber;
  feesToDistribute: ethers.BigNumber;
  feesClaimed: ethers.BigNumber;
  rewardsToDistribute: ethers.BigNumber;
  rewardsClaimed: ethers.BigNumber;
};

type FeePeriodDuration = ethers.BigNumber;

type Results = { [k in keyof FeePeriod]: number } & {
  feePeriodDuration: number;
  rewardsToDistributeBN: BN;
};

export default function useFetchFeePool() {
  const setCurrentFeePeriod = useUpdateAtom(currentFeePeriodAtom);
  const setPreviousFeePeriod = useUpdateAtom(previousFeePeriodAtom);

  const fetchData = useCallback<
    QueryFunction<Results, [string, string, string, Period]>
  >(async ({ queryKey }) => {
    const [, , , period] = queryKey;

    const {
      contracts: { FeePool },
    } = horizon.js!;

    const [feePeriod, feePeriodDuration] = (await Promise.all([
      FeePool.recentFeePeriods(period),
      FeePool.feePeriodDuration(),
    ])) as [FeePeriod, FeePeriodDuration];

    return {
      feePeriodDuration: Number(feePeriodDuration),
      startTime: Number(feePeriod.startTime) || 0,
      feesToDistribute:
        Number(utils.formatEther(feePeriod.feesToDistribute)) || 0,
      feesClaimed: Number(utils.formatEther(feePeriod.feesClaimed)) || 0,
      rewardsToDistribute:
        Number(utils.formatEther(feePeriod.rewardsToDistribute)) || 0,
      rewardsToDistributeBN: etherToBN(feePeriod.rewardsToDistribute),
      rewardsClaimed: Number(utils.formatEther(feePeriod.rewardsClaimed)) || 0,
    };
  }, []);

  // current period
  useQuery([CONTRACT, PUBLIC, "feepool", "0"], fetchData, {
    onSuccess(res) {
      setCurrentFeePeriod(res);
    },
  });

  // previous period
  useQuery([CONTRACT, PUBLIC, "feepool", "1"], fetchData, {
    onSuccess(res) {
      setPreviousFeePeriod(res);
    },
  });
}
