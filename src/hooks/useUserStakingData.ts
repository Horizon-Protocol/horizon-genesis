import { useMemo } from "react";
import { targetRatioAtom, totalIssuedZUSDExclEthAtom } from "@atoms/app";
import { debtAtom } from "@atoms/debt";
import { hznRateAtom, zUSDRateAtom } from "@atoms/exchangeRates";
import { currentFeePeriodAtom, previousFeePeriodAtom } from "@atoms/feePool";
import { minBN, zeroBN } from "@utils/number";
import { WEEKS_IN_YEAR } from "@utils/date";
import { useAtomValue } from "jotai/utils";
import { estimateAprAtom } from "@atoms/summary";

export default function useUserStakingData() {
  const totalIssuedZUSDExclEth = useAtomValue(totalIssuedZUSDExclEthAtom);
  const targetRatio = useAtomValue(targetRatioAtom);
  const hznRate = useAtomValue(hznRateAtom);
  const zUSDRate = useAtomValue(zUSDRateAtom);
  const { debtBalance, collateral, currentCRatio } = useAtomValue(debtAtom);
  const currentFeePeriod = useAtomValue(currentFeePeriodAtom);
  const previousFeePeriod = useAtomValue(previousFeePeriodAtom);

  const stakedValue =
    collateral.gt(0) && currentCRatio.gt(0)
      ? collateral
          .multipliedBy(minBN(1, currentCRatio.dividedBy(targetRatio)))
          .multipliedBy(hznRate)
      : zeroBN;

  const weeklyRewards = zUSDRate
    .multipliedBy(previousFeePeriod.feesToDistribute)
    .plus(hznRate.multipliedBy(previousFeePeriod.rewardsToDistribute));

  const estimateAPR = useAtomValue(estimateAprAtom);

  let stakingAPR = 0;
  let isEstimateAPR = true;
  // compute APR based on the user staked SNX
  if (stakedValue.gt(0) && debtBalance.gt(0)) {
    stakingAPR = weeklyRewards
      .multipliedBy(
        debtBalance
          .dividedBy(totalIssuedZUSDExclEth)
          .multipliedBy(WEEKS_IN_YEAR)
      )
      .dividedBy(stakedValue)
      .toNumber();
    isEstimateAPR = false;
  } else if (estimateAPR) {
    stakingAPR = estimateAPR;
    isEstimateAPR = true;
  }
  // else if (hznRate.gt(0) && totalIssuedZUSDExclEth.gt(0)) {
  //   stakingAPR = zUSDRate
  //     .multipliedBy(previousFeePeriod.feesToDistribute)
  //     .plus(hznRate.multipliedBy(previousFeePeriod.rewardsToDistributeBN))
  //     .multipliedBy(WEEKS_IN_YEAR)
  //     .dividedBy(totalIssuedZUSDExclEth.dividedBy(targetRatio))
  //     .toNumber();
  //   isEstimateAPR = true;
  // }

  const { currentFeePeriodStarts, nextFeePeriodStarts } = useMemo(() => {
    return {
      currentFeePeriodStarts: new Date(
        currentFeePeriod.startTime ? currentFeePeriod.startTime * 1000 : 0
      ),
      nextFeePeriodStarts: new Date(
        currentFeePeriod.startTime
          ? (currentFeePeriod.startTime + currentFeePeriod.feePeriodDuration) *
            1000
          : 0
      ),
    };
  }, [currentFeePeriod]);

  return {
    stakingAPR,
    isEstimateAPR,
    currentFeePeriodStarts,
    nextFeePeriodStarts,
  };
}
