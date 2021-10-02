import { Box, BoxProps, Typography } from "@mui/material";
import { COLOR } from "@utils/theme/constants";
import { formatNumber } from "@utils/number";

interface Props extends BoxProps {
  percent: number;
  isEstimate: boolean;
}

export default function StakingApy({
  percent,
  isEstimate,
  className,
  ...props
}: Props) {
  return (
    <Box
      p={1}
      mx='auto'
      maxWidth={150}
      border='1px solid #11263B'
      color={COLOR.safe}
      {...props}
    >
      <Typography variant='caption'>HZN Staking</Typography>
      <Typography component='div' variant='subtitle1' fontWeight={700}>
        {percent && isEstimate ? (
          <Typography variant='overline' gutterBottom>
            &#8776;{" "}
          </Typography>
        ) : null}
        <span>{percent ? formatNumber(percent) : "--"}</span>% APY
      </Typography>
    </Box>
  );
}
