import { useAtomValue } from "jotai/utils";
import { BoxProps } from "@mui/material";
import { liquidationRatioAtom, targetRatioAtom } from "@atoms/app";
import { collateralDataAtom, debtAtom } from "@atoms/debt";
import { rewardsAtom, feePeriodDatesAtom } from "@atoms/feePool";
import useWallet from "@hooks/useWallet";
import useDateCountDown from "@hooks/useDateCountDown";
import Disconnected from "./Disconnected";
import EmptyStaked from "./EmptyStaked";
import AboveTarget from "./AboveTarget";
import BelowTarget from "./BelowTarget";
import Claimable from "./Claimable";

// const nextFeePeriodStarts = new Date("2021-06-02T23:56:00");

export default function Alert(boxProps: BoxProps) {
  const { account } = useWallet();
  const targetRatio = useAtomValue(targetRatioAtom);
  const liquidationRatio = useAtomValue(liquidationRatioAtom);
  const { currentCRatio, liquidationDeadline } = useAtomValue(debtAtom);
  const { stakedCollateral, unstakedCollateral } =
    useAtomValue(collateralDataAtom);
  const { claimable } = useAtomValue(rewardsAtom);

  const { nextFeePeriodStarts } = useAtomValue(feePeriodDatesAtom);
  const { formatted } = useDateCountDown(nextFeePeriodStarts);

  // wallet not connected
  if (!account) {
    return <Disconnected {...boxProps} />;
  }
  // staked 0
  if (stakedCollateral.eq(0)) {
    return <EmptyStaked unstaked={unstakedCollateral} {...boxProps} />;
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
  // above targetRatio percent
  if (currentCRatio.gt(0) && currentCRatio.lt(targetRatio)) {
    return (
      <AboveTarget
        targetRatio={targetRatio}
        liquidationDeadline={liquidationDeadline}
        {...boxProps}
      />
    );
  }
  // claimable
  if (claimable) {
    return <Claimable periodEnds={formatted} {...boxProps} />;
  }

  return null;
}
