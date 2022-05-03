import { Box, Button, Grid, SvgIcon, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { COLOR, PAGE_COLOR } from "@utils/theme/constants";
import ActionLink from "@components/Alerts/ActionLink";
const Img = styled("img")``;
import { useHistory } from "react-router-dom";
import { LINK_EXCHANGE } from "@utils/constants";
import { ReactComponent as IconzUSD } from "@assets/images/zUSD.svg";

export default function BannerUseOfZusd() {
  const history = useHistory()

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
      height='auto'
      width='100%'
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
    >
      <SvgIcon
      sx={{
        width: "64px",
          height: "64px",
      }}
      >
        <IconzUSD />
      </SvgIcon>
      <Typography
        textAlign='center'
        fontSize={14}
        fontWeight='bold'
        lineHeight='16px'
        fontFamily='Raleway'
        letterSpacing={1}
        mt='14px'
        color='white'
      >
        WHAT CAN I DO WITH MY zUSD?
      </Typography>
      <Typography
        textAlign='center'
        fontSize={{
          xs:12,
          sm:14
        }}
        lineHeight='19px'
        fontWeight='normal'
        fontFamily='Rawline'
        letterSpacing={1}
        color='rgba(180, 224, 255, 0.75)'
        sx={{
          mt:'10px'
        }}
      >
        You can use zUSD to purchase other synthetic <br/>assets (zAssets) on Horizon Exchange, trade it on <br/>a DEX, or supply liquidity to the zUSD stablecoin <br/>pool to earn yield.
      </Typography>
      <Box
        // width='190px'
        height='20px'
        display='flex'
        alignItems='center'
        justifyContent='space-around'
        marginTop='15px'
      >
        <ActionLink fontSize='12px !important' href={LINK_EXCHANGE} target='_blank'>TRADE</ActionLink>
        <ActionLink marginLeft='20px' fontSize='12px !important' href={"https://pancakeswap.finance/add/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56/0xF0186490B18CB74619816CfC7FeB51cdbe4ae7b9"} target='_blank' color={COLOR.warning} >SUPPLY</ActionLink>
        <ActionLink marginLeft='20px' fontSize='12px !important' color={COLOR.text} to='/earn'>EARN</ActionLink>
      </Box>
    </Box>
  );
}
