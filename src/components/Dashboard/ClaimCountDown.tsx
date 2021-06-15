import { Box, BoxProps, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useAtomValue } from "jotai/utils";
import { nextClaimCountDownAtom } from "@atoms/feePool";
import useNextClaimCountDown from "@hooks/useNextClaimTimer";

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

export default function ClaimCountDown(props: BoxProps) {
  const classes = useStyles();

  useNextClaimCountDown();

  const nextClaimCountDown = useAtomValue(nextClaimCountDownAtom);

  return (
    <Box textAlign='center' {...props}>
      <Typography variant='caption' className={classes.title}>
        NEXT REWARD CLAIM
      </Typography>
      <Typography variant='h5' className={classes.value}>
        {nextClaimCountDown}
      </Typography>
    </Box>
  );
}
