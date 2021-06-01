import { useCallback } from "react";
import { useQuery, QueryFunction } from "react-query";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { ethers, utils } from "ethers";
import horizon from "@lib/horizon";
import { needRefreshAtom } from "@atoms/app";
import { currentFeePeriodAtom, previoudFeePeriodAtom } from "@atoms/feePool";
import { toBigNumber } from "@utils/number";
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
  const needRefresh = useAtomValue(needRefreshAtom);

  const setCurrentFeePeriod = useUpdateAtom(currentFeePeriodAtom);
  const setPreviousFeePeriod = useUpdateAtom(previoudFeePeriodAtom);

  const fetchData = useCallback<
    QueryFunction<Results, [string, string, string, Period, boolean]>
  >(async ({ queryKey }) => {
    console.log("fetch", ...queryKey);

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
      rewardsToDistributeBN: toBigNumber(
        utils.formatEther(feePeriod.rewardsToDistribute)
      ),
      rewardsClaimed: Number(utils.formatEther(feePeriod.rewardsClaimed)) || 0,
    };
  }, []);

  // current period
  useQuery([CONTRACT, PUBLIC, "feepool", "0", needRefresh], fetchData, {
    onSuccess(res) {
      setCurrentFeePeriod(res);
    },
  });

  // previous period
  useQuery([CONTRACT, PUBLIC, "feepool", "1", needRefresh], fetchData, {
    onSuccess(res) {
      setPreviousFeePeriod(res);
    },
  });
}
