import { Box, BoxProps, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useClaimCountDown from "@hooks/useClaimCountDown";

const useStyles = makeStyles({
  title: {
    fontWeight: 700,
    letterSpacing: "0.43px",
    color: "#62B5DB",
  },
  value: {
    marginTop: 8,
    color: "#B4E0FF",
    fontSize: "24px",
    fontWeight: 700,
    letterSpacing: "0.86px",
    lineHeight: "28px",
  },
});

export default function ClaimCountDown(props: BoxProps) {
  const classes = useStyles();

  const { formatted } = useClaimCountDown();

  return (
    <Box textAlign='center' {...props}>
      <Typography variant='caption' className={classes.title}>
        NEXT REWARD CLAIM
      </Typography>
      <Typography variant='h5' className={classes.value}>
        {formatted}
      </Typography>
    </Box>
  );
}
