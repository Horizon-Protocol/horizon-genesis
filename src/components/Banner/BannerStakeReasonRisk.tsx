import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { PAGE_COLOR } from "@utils/theme/constants";
const Img = styled("img")``;

type bannarProps = {
  img?: string;
  title: string;
  desc: string | JSX.Element;
  highlightText: string;
  to?: string;
}

export default function BannerStakeReasonRisk({
  img,
  title,
  desc,
  highlightText,
  to
} : bannarProps) {
  return (
    <Box
      height='240px'
      width='100%'
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
    >
      <Img
        src={img}
        sx={{
          width: "32px",
          height: "32px",
        }}
      />
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
        <span style={{
          fontSize: 13,
          fontWeight: 'bold',
          color: PAGE_COLOR.mint
        }}>{highlightText}</span>
      </Typography>
    </Box>
  );
}
