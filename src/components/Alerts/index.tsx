import { useAtomValue } from "jotai/utils";
import { BoxProps } from "@mui/material";
import { liquidationRatioAtom, targetRatioAtom } from "@atoms/app";
import { collateralDataAtom, debtAtom } from "@atoms/debt";
import { rewardsAtom, feePeriodDatesAtom } from "@atoms/feePool";
import useWallet from "@hooks/useWallet";
import Disconnected from "./Disconnected";
import EmptyStaked from "./EmptyStaked";
import AboveTarget from "./AboveTarget";
import BelowTarget from "./BelowTarget";
import Claimable from "./Claimable";
import { formatNumber } from "@utils/number";
// const nextFeePeriodStarts = new Date("2021-06-02T23:56:00");

export default function Alerts(boxProps: BoxProps) {
  const { account } = useWallet();
  const targetRatio = useAtomValue(targetRatioAtom);
  const liquidationRatio = useAtomValue(liquidationRatioAtom);
  const { currentCRatio, liquidationDeadline } = useAtomValue(debtAtom);
  const { stakedCollateral, unstakedCollateral } =
    useAtomValue(collateralDataAtom);
  const { claimable } = useAtomValue(rewardsAtom);


  console.log('=====currentCRatio=====',{
    liquidationRatio:formatNumber(liquidationRatio),
    liquidationDeadline:formatNumber(liquidationDeadline),
    stakedCollateral:formatNumber(stakedCollateral),
    unstakedCollateral:formatNumber(unstakedCollateral),
    claimable:claimable,
    currentCRatio:formatNumber(currentCRatio),
    targetRatio:formatNumber(targetRatio)
  })
  
  // wallet not connected
  if (!account) {
    return <Disconnected {...boxProps} />;
  }
  // staked 0, start to stake
  if (stakedCollateral.eq(0)) {
    return <EmptyStaked unstaked={unstakedCollateral} {...boxProps} />;
  }
  // claimable
  if (claimable) {
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
