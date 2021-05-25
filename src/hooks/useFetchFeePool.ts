import { useRequest } from "ahooks";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { ethers, utils } from "ethers";
import horizon from "@lib/horizon";
import { readyAtom } from "@atoms/app";
import { toBigNumber } from "@utils/number";

type Period = "0" | "1"; // '0': current; '1': previous

type FeePeriod = {
  startTime: ethers.BigNumber;
  feesToDistribute: ethers.BigNumber;
  feesClaimed: ethers.BigNumber;
  rewardsToDistribute: ethers.BigNumber;
  rewardsClaimed: ethers.BigNumber;
};
type FeePeriodDuration = ethers.BigNumber;

export default function useFetchFeePool(period: Period) {
  const appReady = useAtomValue(readyAtom);

  useRequest(
    async () => {
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
        rewardsClaimed:
          Number(utils.formatEther(feePeriod.rewardsClaimed)) || 0,
      };
    },
    {
      ready: appReady && !!horizon.js,
      onSuccess(res) {
        console.log(res);
      },
    }
  );
}
