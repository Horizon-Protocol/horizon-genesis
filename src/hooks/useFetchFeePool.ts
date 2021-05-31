import { useRequest } from "ahooks";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { ethers, utils } from "ethers";
import horizon from "@lib/horizon";
import { needRefreshAtom } from "@atoms/app";
import { currentFeePeriodAtom, previoudFeePeriodAtom } from "@atoms/feePool";
import { toBigNumber } from "@utils/number";
import { useCallback } from "react";

type Period = "0" | "1"; // '0': current; '1': previous

type FeePeriod = {
  startTime: ethers.BigNumber;
  feesToDistribute: ethers.BigNumber;
  feesClaimed: ethers.BigNumber;
  rewardsToDistribute: ethers.BigNumber;
  rewardsClaimed: ethers.BigNumber;
};
type FeePeriodDuration = ethers.BigNumber;

export default function useFetchFeePool() {
  const needRefresh = useAtomValue(needRefreshAtom);

  const setCurrentFeePeriod = useUpdateAtom(currentFeePeriodAtom);
  const setPreviousFeePeriod = useUpdateAtom(previoudFeePeriodAtom);

  const fetchData = useCallback(async (period: Period) => {
    console.log("load fee pool", period);
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
  useRequest(fetchData, {
    defaultParams: ["0"],
    ready: needRefresh && !!horizon.js,
    refreshDeps: [needRefresh],
    onSuccess(res, [period]) {
      console.log(res);
      setCurrentFeePeriod(res);
    },
  });

  // previous period
  useRequest(fetchData, {
    defaultParams: ["1"],
    ready: !!horizon.js,
    onSuccess(res, [period]) {
      setPreviousFeePeriod(res);
    },
  });
}
