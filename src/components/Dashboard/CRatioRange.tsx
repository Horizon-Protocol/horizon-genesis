import { useMemo } from "react";
import {
  Box,
  Typography,
  LinearProgress,
  LinearProgressProps,
  BoxProps,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { HelpOutline } from "@material-ui/icons";
import { COLOR } from "@utils/theme/constants";

const getColorByRatio = (ratio: number) => {
  if (ratio < 200) {
    return COLOR.danger;
  }
  if (ratio < 700) {
    return COLOR.warning;
  }
  return COLOR.safe;
};

const getPercentByRatio = (ratio: number) => {
  let percent = 0;
  if (ratio < 0) {
    percent = 0;
  } else if (ratio < 200) {
    percent = (ratio / 200) * 25;
  } else if (ratio < 700) {
    percent = 25 + ((ratio - 200) / 500) * 50;
  } else {
    // ratio >= 700
    percent = 75 + ((ratio - 700) / 300) * 25;
  }

  return percent;
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
  progress: {
    position: "relative",
    paddingBottom: 32,
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

const BorderedProgress = withStyles(({ palette }) => ({
  root: {
    height: 24,
    borderRadius: 4,
    border: `1px solid ${COLOR.border}`,
  },
  colorPrimary: {
    backgroundColor: "transparent",
  },
  bar: {
    backgroundColor: ({ valueBuffer = 0 }: LinearProgressProps) =>
      getColorByRatio(valueBuffer),
    borderRadius: 0,
  },
}))(LinearProgress);

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

interface Props extends BoxProps {
  ratio: number;
}

export default function CRatioRange({ ratio = 700, ...props }: Props) {
  const { percent, color } = useMemo(
    () => ({
      color: getColorByRatio(ratio),
      percent: getPercentByRatio(ratio),
    }),
    [ratio]
  );

  const classes = useStyles();

  return (
    <Box py={3} textAlign='center' {...props}>
      <Typography
        variant='h6'
        classes={{ root: classes.number }}
        style={{ color }}
      >
        {ratio}%
      </Typography>
      <Typography variant='subtitle2' classes={{ root: classes.tip }}>
        Current C-Ratio &nbsp;
        <HelpOutline fontSize='inherit' />
      </Typography>
      <Box className={classes.progress}>
        <BorderedProgress
          variant='determinate'
          value={percent}
          valueBuffer={ratio}
        />
        <Tick
          percent={200}
          left='25%'
          label='Liquidation'
          color={COLOR.danger}
        />
        <Tick percent={700} left='75%' label='Target' color={COLOR.safe} />
      </Box>
    </Box>
  );
}