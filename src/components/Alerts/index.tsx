import { useMemo } from "react";
import { useAtomValue } from "jotai/utils";
import { Box, BoxProps } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { COLOR } from "@utils/theme/constants";
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

const useStyles = makeStyles({
  container: {
    borderRadius: 4,
    borderTop: ({ color }: { color: string }) => `2px solid ${color}`,
    backgroundColor: "#102637",
    color: ({ color }: { color: string }) => color,
  },
});

// const nextFeePeriodStarts = new Date("2021-06-02T23:56:00");

export default function Alert({ className, ...props }: BoxProps) {
  const { account } = useWallet();
  const targetRatio = useAtomValue(targetRatioAtom);
  const liquidationRatio = useAtomValue(liquidationRatioAtom);
  const { currentCRatio, liquidationDeadline } = useAtomValue(debtAtom);
  const { stakedCollateral, unstakedCollateral } =
    useAtomValue(collateralDataAtom);
  const { claimable } = useAtomValue(rewardsAtom);

  const { nextFeePeriodStarts } = useAtomValue(feePeriodDatesAtom);
  const { formatted } = useDateCountDown(nextFeePeriodStarts);

  const { color, component } = useMemo(() => {
    let color = COLOR.tip;
    let alertComponent = null;

    // wallet not connected
    if (!account) {
      alertComponent = <Disconnected />;
    }
    // staked 0
    else if (stakedCollateral.eq(0)) {
      alertComponent = <EmptyStaked unstaked={unstakedCollateral} />;
    }
    // below targetRatio percent
    else if (currentCRatio.gt(0) && currentCRatio.gt(targetRatio)) {
      color = COLOR.warning;
      alertComponent = (
        <BelowTarget
          currentCRatio={currentCRatio}
          targetRatio={targetRatio}
          liquidationRatio={liquidationRatio}
          liquidationDeadline={liquidationDeadline}
        />
      );
    }
    // above targetRatio percent
    else if (currentCRatio.gt(0) && currentCRatio.lt(targetRatio)) {
      alertComponent = (
        <AboveTarget
          targetRatio={targetRatio}
          liquidationDeadline={liquidationDeadline}
        />
      );
    }
    // claimable
    else if (claimable) {
      alertComponent = <Claimable periodEnds={formatted} />;
    }
    return { color, component: alertComponent };
  }, [
    account,
    stakedCollateral,
    currentCRatio,
    targetRatio,
    claimable,
    unstakedCollateral,
    liquidationRatio,
    liquidationDeadline,
    formatted,
  ]);

  const classes = useStyles({ color });

  if (!component) {
    return null;
  }

  return (
    <Box
      display='flex'
      className={clsx(className, classes.container)}
      {...props}
    >
      {component}
    </Box>
  );
}
