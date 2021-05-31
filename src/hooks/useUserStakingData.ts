import { useMemo } from "react";
import { targetCRatioAtom, totalIssuedZUSDExclEthAtom } from "@atoms/app";
import { debtAtom } from "@atoms/debt";
import { hznRateAtom, zUSDRateAtom } from "@atoms/exchangeRates";
import { currentFeePeriodAtom, previoudFeePeriodAtom } from "@atoms/feePool";
import { minBN, zeroBN } from "@utils/number";
import { WEEKS_IN_YEAR } from "@utils/date";
import { useAtomValue } from "jotai/utils";

export default function useUserStakingData() {
  const totalIssuedZUSDExclEth = useAtomValue(totalIssuedZUSDExclEthAtom);
  const targetCRatio = useAtomValue(targetCRatioAtom);
  const hznRate = useAtomValue(hznRateAtom);
  const zUSDRate = useAtomValue(zUSDRateAtom);
  const { debtBalance, collateral, currentCRatio } = useAtomValue(debtAtom);
  const currentFeePeriod = useAtomValue(currentFeePeriodAtom);
  const previousFeePeriod = useAtomValue(previoudFeePeriodAtom);

  const stakedValue =
    collateral.gt(0) && currentCRatio.gt(0)
      ? collateral
          .multipliedBy(minBN(1, currentCRatio.dividedBy(targetCRatio)))
          .multipliedBy(hznRate)
      : zeroBN;

  const weeklyRewards = zUSDRate
    .multipliedBy(previousFeePeriod.feesToDistribute)
    .plus(hznRate.multipliedBy(previousFeePeriod.rewardsToDistribute));

  let stakingAPR = 0;
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
  }
  // estimate apr by top 100 holders
  // else if (
  //   hznRate != null &&
  //   zUSDRate != null &&
  //   previousFeePeriod != null &&
  //   currentFeePeriod.data != null &&
  //   useSNXLockedValue.data != null &&
  //   debtData.data != null
  // ) {
  //   // compute APR based using useSNXLockedValueQuery (top 1000 holders)
  //   stakingAPR = zUSDRate
  //         .multipliedBy(currentFeePeriod.data.feesToDistribute)
  //         .plus(hznRate.multipliedBy(currentFeePeriod.data.rewardsToDistribute))
  //         .multipliedBy(WEEKS_IN_YEAR)
  //         .dividedBy(useSNXLockedValue.data)
  //         .toNumber();
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
    currentFeePeriodStarts,
    nextFeePeriodStarts,
  };
}
