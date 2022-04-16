import { Box, BoxProps, Button, Typography } from "@mui/material";
import { PAGE_COLOR } from "@utils/theme/constants";

type bannarProps = {
  img?: string | JSX.Element;
  title: string;
  desc: string | JSX.Element;
  highlightText?: string;
  to?: string;
}

export default function BannerStakeReasonRisk({
  img,
  title,
  desc,
  highlightText,
  to,
  ...highLightProps
} : bannarProps & BoxProps) {
  return (
    <Box
      height='240px'
      width='100%'
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
    >
      {img}
      <Typography
        textAlign='center'
        fontSize={14}
        fontWeight='bold'
        lineHeight='16px'
        fontFamily='Raleway'
        letterSpacing={1}
        mt='14px'
      >
        {title}
      </Typography>
      <Typography
        textAlign='center'
        fontSize={12}
        fontWeight='normal'
        fontFamily='Rawline'
        lineHeight='16px'
        letterSpacing={1}
        color='rgba(180, 224, 255, 0.75)'
        sx={{
          mt:'10px'
        }}
      >
        {desc}
        <Box {...highLightProps} component='span' sx={{
          fontSize: 13,
          fontWeight: 'bold',
          color: PAGE_COLOR.mint,
        }}
        >{highlightText}</Box>
      </Typography>
    </Box>
  );
}
