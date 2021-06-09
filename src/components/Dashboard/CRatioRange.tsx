import { useMemo } from "react";
import { Box, Typography, LinearProgress, BoxProps } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { HelpOutline } from "@material-ui/icons";
import { useAtomValue } from "jotai/utils";
import { ratiosPercentAtom } from "@atoms/app";
import { currentCRatioPercentAtom } from "@atoms/debt";
import { formatNumber } from "@utils/number";
import { COLOR } from "@utils/theme/constants";

const getColorByRatioPercent = (
  ratioPercent: number,
  liquidationPercent: number,
  targetPercent: number
) => {
  if (ratioPercent <= liquidationPercent) {
    return COLOR.danger;
  }
  if (ratioPercent < targetPercent) {
    return COLOR.warning;
  }
  return COLOR.safe;
};

const getProgressByRatioPercent = (
  ratioPercent: number,
  liquidationPercent: number,
  targetPercent: number
) => {
  let percent = 0;
  if (ratioPercent <= 0) {
    percent = 0;
  } else if (ratioPercent < liquidationPercent) {
    percent = (ratioPercent / liquidationPercent) * 25;
  } else if (ratioPercent < targetPercent) {
    percent =
      25 +
      ((ratioPercent - liquidationPercent) /
        (targetPercent - liquidationPercent)) *
        50;
  } else {
    // ratio >= target
    percent =
      75 + ((ratioPercent - targetPercent) / (1000 - targetPercent)) * 25;
  }

  return Math.min(percent, 100);
};

const useStyles = makeStyles(() => ({
  number: {
    fontSize: 22,
    letterSpacing: "0.92px",
    lineHeight: "26px",
    textAlign: "center",
  },
  tip: {
    margin: "8px 0 16px",
    lineHeight: "14px",
    letterSpacing: "0.5px",
  },
  progressWrap: {
    position: "relative",
    paddingBottom: 32,
  },
  progress: {
    height: 24,
    borderRadius: 4,
    border: `1px solid ${COLOR.border}`,
  },
  progressPrimary: {
    backgroundColor: "transparent",
  },
  progressBar: {
    backgroundColor: ({ color }: { color?: string }) => color,
    borderRadius: 0,
  },
  tick: {
    position: "absolute",
    top: 1,
  },
  tickLine: {
    display: "block",
    height: 24,
    borderLeft: `1px solid ${COLOR.border}`,
  },
}));

const TickLabel = withStyles(() => ({
  root: {
    fontSize: 9,
    transform: "translateX(-50%)",
    marginTop: 4,
  },
}))(Typography);

const Tick = ({
  percent = 0,
  left = 0,
  label,
  color,
}: {
  percent: number;
  left: number | string;
  label: string;
  color?: string;
}) => {
  const classes = useStyles({ color });

  return (
    <Box className={classes.tick} style={{ left, color }}>
      <Box className={classes.tickLine} />
      <TickLabel>
        <strong>{percent}%</strong>
        <br />
        {label}
      </TickLabel>
    </Box>
  );
};

export default function CRatioRange(props: BoxProps) {
  const { targetCRatioPercent, liquidationRatioPercent } =
    useAtomValue(ratiosPercentAtom);
  const currentCRatioPercent = useAtomValue(currentCRatioPercentAtom);

  const { progress, color } = useMemo(
    () => ({
      color: getColorByRatioPercent(
        currentCRatioPercent,
        liquidationRatioPercent,
        targetCRatioPercent
      ),
      progress: getProgressByRatioPercent(
        currentCRatioPercent,
        liquidationRatioPercent,
        targetCRatioPercent
      ),
    }),
    [currentCRatioPercent, liquidationRatioPercent, targetCRatioPercent]
  );

  const classes = useStyles({ color });

  return (
    <Box py={3} textAlign='center' {...props}>
      <Typography
        variant='h6'
        classes={{ root: classes.number }}
        style={{ color: currentCRatioPercent ? color : undefined }}
      >
        {currentCRatioPercent ? formatNumber(currentCRatioPercent) : "--"}%
      </Typography>
      <Typography variant='subtitle2' classes={{ root: classes.tip }}>
        Current C-Ratio
        <HelpOutline fontSize='inherit' />
      </Typography>
      <Box className={classes.progressWrap}>
        <LinearProgress
          variant='determinate'
          value={progress}
          valueBuffer={currentCRatioPercent}
          classes={{
            root: classes.progress,
            colorPrimary: classes.progressPrimary,
            bar: classes.progressBar,
          }}
        />
        {liquidationRatioPercent > 0 && (
          <Tick
            percent={liquidationRatioPercent}
            left='25%'
            label='Liquidation'
            color={COLOR.danger}
          />
        )}
        {targetCRatioPercent > 0 && (
          <Tick
            percent={targetCRatioPercent}
            left='75%'
            label='Target'
            color={COLOR.safe}
          />
        )}
      </Box>
    </Box>
  );
}
