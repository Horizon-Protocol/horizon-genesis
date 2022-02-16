import { Box, BoxProps, Typography } from "@mui/material";
import { COLOR } from "@utils/theme/constants";
import { formatNumber } from "@utils/number";

interface Props extends BoxProps {
  maxWidth: number,
  title: string,
  desc: string | JSX.Element;
}


export default function HZNInfoPrice({
  // percent,
  // isEstimate,
  className,
  maxWidth,
  title,
  desc,
  ...props
}: Props) {
  return (
    <Box
      p={1}
      // mx='auto'
      // maxWidth={maxWidth}
      borderRadius='4px'
      // border='1px solid #11263B'
      {...props}
    >
      <Typography sx={{opacity:0.5}} fontSize={12} color={COLOR.text} variant='caption'>{title}</Typography>
      <Typography letterSpacing='1px' fontFamily='Rawline' fontSize={16} color={COLOR.safe} component='div' variant='subtitle1' fontWeight={700}>
        {desc}
      </Typography>
    </Box>
  );
}
