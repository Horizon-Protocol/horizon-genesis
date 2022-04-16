import { Box, BoxProps, Typography } from "@mui/material";
import { COLOR } from "@utils/theme/constants";
import { formatNumber } from "@utils/number";

interface Props extends BoxProps {
  // maxWidth: number,
  title: string,
  desc: string | JSX.Element;
}


export default function HZNInfoPrice({
  // percent,
  // isEstimate,
  className,
  // maxWidth,
  title,
  desc,
  ...props
}: Props) {
  return (
    <Box
      borderRadius='4px'
      sx={{
        display:'flex',
        flexDirection:'column',
        justifyContent:'center'
      }}
      {...props}
    >
      <Typography lineHeight='14px' sx={{opacity:0.5}} fontSize={12} color={COLOR.text}>{title}</Typography>
      <Typography lineHeight='19px' letterSpacing='1px' fontFamily='Rawline' fontSize={16} color={COLOR.safe} component='div' fontWeight={700}>
        {desc}
      </Typography>
    </Box>
  );
}
