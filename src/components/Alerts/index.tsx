import { useAtomValue } from "jotai/utils";
import { BoxProps } from "@mui/material";
import { liquidationRatioAtom, suspensionStatusAtom, targetRatioAtom } from "@atoms/app";
import { collateralDataAtom, debtAtom } from "@atoms/debt";
import { rewardsAtom, feePeriodDatesAtom } from "@atoms/feePool";
import useWallet from "@hooks/useWallet";
import Disconnected from "./Disconnected";
import EmptyStaked from "./EmptyStaked";
import AboveTarget from "./AboveTarget";
import BelowTarget from "./BelowTarget";
import Claimable from "./Claimable";
import Suspension from "./Suspension";
import { formatNumber } from "@utils/number";
// const nextFeePeriodStarts = new Date("2021-06-02T23:56:00");
import { getTodayTimestampSeconds, secondsOfDays } from "@utils/date";
import { currentFeePeriodAtom } from "@atoms/feePool";

export default function Alerts(boxProps: BoxProps) {
  const { account } = useWallet();
  const targetRatio = useAtomValue(targetRatioAtom);
  const liquidationRatio = useAtomValue(liquidationRatioAtom);
  const { currentCRatio, liquidationDeadline } = useAtomValue(debtAtom);
  const { stakedCollateral, unstakedCollateral } =
    useAtomValue(collateralDataAtom);
  const { claimable } = useAtomValue(rewardsAtom);
  const suspentionStatus = useAtomValue(suspensionStatusAtom)
  const { startTime, feePeriodDuration } = useAtomValue(currentFeePeriodAtom);

  // console.log('=====currentCRatio=====',{
  //   liquidationRatio:formatNumber(liquidationRatio),
  //   liquidationDeadline:formatNumber(liquidationDeadline),
  //   stakedCollateral:formatNumber(stakedCollateral),
  //   unstakedCollateral:formatNumber(unstakedCollateral),
  //   claimable:claimable,
  //   currentCRatio:formatNumber(currentCRatio),
  //   targetRatio:formatNumber(targetRatio)
  // })
  
  //if system suspention - high priority
  if (suspentionStatus.status){
    return (
      <Suspension reason={2} {...boxProps}/>
    )
  }

  // wallet not connected
  if (!account) {
    return <Disconnected {...boxProps} />;
  }
  // staked 0, start to stake
  if (stakedCollateral.eq(0)) {
    return <EmptyStaked unstaked={unstakedCollateral} {...boxProps} />;
  }

  const leftTimeSecondToClaim = (startTime + feePeriodDuration) - getTodayTimestampSeconds()
  // claimable
  if (claimable && leftTimeSecondToClaim < secondsOfDays(3)) {
    return <Claimable {...boxProps} />;
  }

   // below targetRatio percent
   if (currentCRatio.gt(0) && currentCRatio.gt(targetRatio)) {
    return (
      <BelowTarget
        currentCRatio={currentCRatio}
        targetRatio={targetRatio}
        liquidationRatio={liquidationRatio}
        liquidationDeadline={liquidationDeadline}
        {...boxProps}
      />
    );
  }
  // 1.above targetRatio percent
  if (currentCRatio.gt(0) && currentCRatio.lt(targetRatio)) {
    return (
      <AboveTarget
        targetRatio={targetRatio}
        liquidationDeadline={liquidationDeadline}
        {...boxProps}
      />
    );
  }

  return null;
}
