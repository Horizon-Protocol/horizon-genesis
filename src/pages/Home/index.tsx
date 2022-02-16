
import { Box, Grid, Typography } from "@mui/material";
import Carousel from 'react-material-ui-carousel'
import { useEffect } from "react";
import { COLOR, PAGE_COLOR } from "@utils/theme/constants";
import navNext from "@assets/images/next.png";
import navPre from "@assets/images/pre.png";
import BannerMint from "@components/Banner/BannerMint";
import BannerStakeReason from "@components/Banner/BannerStakeReason";
import BannerUseOfZusd from "@components/Banner/BannerUseOfZusd";
import "./styles.css"
import PageCard from "@components/PageCard";
import { styled } from "@mui/styles";
import GridCrad from "@components/Banner/GridCrad";

const gridCards: GridCardProps[] = [
  {
    titleColor: PAGE_COLOR.mint,
    icon: '',
    title: 'Mint',
    desc: <>Stake HZN to mint zUSD and<br/>earn 194.14% APY</>
  },
  {
    titleColor: PAGE_COLOR.burn,
    icon: '',
    title: 'Burn',
    desc: <>Burn zUSD to unstake HZN and<br/>increase your C-Ratio</>
  },
  {
    titleColor: COLOR.text,
    icon: '',
    title: 'Claim',
    desc: <>Claim your weekly staking and<br/>exchange rewards</>,
    showAlert: true
  },
  {
    titleColor: COLOR.text,
    icon: '',
    title: 'Trade',
    desc: <>Trade between zAssets on<br/>Horizon Exchange</>
  },
  {
    titleColor: COLOR.text,
    icon: '',
    title: 'Earn',
    desc: <>Supply liquidity and stake LPs to<br/>earn yield</>
  },
  {
    titleColor: COLOR.text,
    icon: '',
    title: 'Learn',
    desc: <>Learn what’s under the hood for<br/>Horizon Protocol</>
  },
];

export default function Home() {

  useEffect(() => {

  }, []);

  return (
    <Box
      mx='auto'
      maxWidth={640}
      position={"relative"}
      bgcolor='rgba(16,38,55,0.3)'
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      sx={{
      }}
    >
      <Carousel
        animation="slide"
        autoPlay={false}
        className="home_carousel"
        duration={1000}
        navButtonsAlwaysVisible={true}
        NextIcon={<img src={navNext}></img>}
        PrevIcon={<img src={navPre}></img>}
        indicatorIconButtonProps={{
          style: {
            padding: '5px',
            color: COLOR.text,
            opacity: .5
          }
        }}
        activeIndicatorIconButtonProps={{
          style: {
            color: PAGE_COLOR.mint,
            padding: '5px',
            opacity: .5
          }
        }}
        indicatorContainerProps={{
          style: {
            // backgroundColor: "red",3
            textAlign: 'center'
          }
        }}
      >
        <BannerMint />
        <BannerStakeReason />
        <BannerUseOfZusd />
      </Carousel>
      <Box sx={{
        mt: '30px',
        mb: '50px',
        width: '450px',
        height: '300px',
        flexGrow: 1
      }}>
        <Grid container spacing='2px' columns={12}>
          {gridCards.map((item: GridCardProps)=>{
            return (
              <Grid item xs={6} sm={6} md={6} key={item.title}>
                <GridCrad titleColor={item.titleColor} title={item.title} desc={item.desc} icon={item.icon} showAlert={item.showAlert}/>
             </Grid>
            )
          })}
        </Grid>
      </Box>
    </Box >
  );
}