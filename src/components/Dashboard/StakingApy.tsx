import { Box, BoxProps, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { COLOR } from "@utils/theme/constants";

const useStyles = makeStyles(({ palette }) => ({
  container: {
    maxWidth: 150,
    border: "1px solid #11263B",
    color: COLOR.safe,
  },
  percent: {
    fontWeight: 700,
  },
  percentValue: {},
}));

interface Props extends BoxProps {
  percent: number;
}

export default function StakingApy({ percent, className, ...props }: Props) {
  const classes = useStyles();

  return (
    <Box
      p={1}
      mx='auto'
      className={clsx(classes.container, className)}
      {...props}
    >
      <Typography variant='caption'>HZN Staking</Typography>
      <Typography
        component='div'
        variant='subtitle1'
        className={classes.percent}
      >
        <span className={classes.percentValue}>{percent}</span>% APY
      </Typography>
    </Box>
  );
}
