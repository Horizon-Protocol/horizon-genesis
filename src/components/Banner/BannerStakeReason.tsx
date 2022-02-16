import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { PAGE_COLOR } from "@utils/theme/constants";
import mintBg from "@assets/bgs/hzn.png";
const Img = styled("img")``;

export default function BannerStakeReason() {
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
        src={mintBg}
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
        WHY STAKE HZN?
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
        Staking HZN, and minting zUSD, will allow you to <br/>earn staking rewards from the protocol as well as <br/>a split of the zUSD transaction fees generated on <br/>Horizon Exchange.  HZN staking rewards are <br/>currently
        <span style={{
          fontSize: 13,
          fontWeight: 'bold',
          color: PAGE_COLOR.mint
        }}> 194.14% APY.</span>
      </Typography>
    </Box>
  );
}
