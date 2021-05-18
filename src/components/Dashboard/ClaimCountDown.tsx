import { useMemo } from "react";
import { Box, BoxProps, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useTimer } from "react-compound-timer";
import differenceInMilliseconds from "date-fns/differenceInMilliseconds";

const useStyles = makeStyles({
  title: {
    fontWeight: 700,
    letterSpacing: "0.43px",
    color: "#62B5DB",
  },
  value: {
    marginTop: 8,
    color: "#B4E0FF",
    fontFamily: "Rawline",
    fontSize: "24px",
    fontWeight: 700,
    letterSpacing: "0.86px",
    lineHeight: "28px",
  },
});

interface Props extends BoxProps {
  date: Date;
}

export default function ClaimCountDown({ date, ...props }: Props) {
  const classes = useStyles();

  const milliSeconds = useMemo(
    () => (date ? differenceInMilliseconds(date, new Date()) : 0),
    [date]
  );

  const {
    value: { d, h, m, s },
  } = useTimer({
    initialTime: milliSeconds,
    direction: "backward",
  });

  if (!date || milliSeconds <= 0) {
    return null;
  }

  return (
    <Box textAlign='center' {...props}>
      <Typography variant='caption' className={classes.title}>
        NEXT REWARD CLAIM
      </Typography>
      <Typography variant='h5' className={classes.value}>
        {d}d {h}h {m}m
      </Typography>
    </Box>
  );
}
