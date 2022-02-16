import { Box, Button, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { COLOR, PAGE_COLOR } from "@utils/theme/constants";
import mintBg from "@assets/bgs/hzn.png";
import ActionLink from "@components/Alerts/ActionLink";
const Img = styled("img")``;

export default function BannerUseOfZusd() {

  interface LinkProps {
    label: string;
    // click: ()=>{};
    color: string;
  }
  
  const tabs: LinkProps[] = [
    {
      label: "Home",
      color: PAGE_COLOR.mint,
    },
    {
      label: "Mint",
      color: PAGE_COLOR.mint,
    },
    {
      label: "Burn",
      color: PAGE_COLOR.burn,
    },
  ];
  
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
        WHAT CAN I DO WITH MY zUSD?
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
        ou can use zUSD to purchase other synthetic <br/>assets (zAssets) on Horizon Exchange, trade it on <br/>a DEX, or supply liquidity to the zUSD stablecoin <br/>pool to earn yield.
      </Typography>
      <Box
        width='190px'
        height='20px'
        display='flex'
        alignItems='center'
        justifyContent='space-around'
        marginTop='10px'
      >
        <ActionLink to='/'>TRADE</ActionLink>
        <ActionLink color={COLOR.warning} to='/'>SUPPLY</ActionLink>
        <ActionLink color={COLOR.text} to='/'>EARN</ActionLink>
      </Box>
    </Box>
  );
}
