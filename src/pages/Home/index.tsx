import { Box, Grid, Typography } from "@mui/material";
import Carousel from 'react-material-ui-carousel'
import { useEffect } from "react";
import { COLOR, PAGE_COLOR } from "@utils/theme/constants";
import navNext from "@assets/images/next.png";
import navPre from "@assets/images/pre.png";
import BannerMint from "@components/Banner/BannerMint";
import BannerStakeReasonRisk from "@components/Banner/BannerStakeReasonRisk";
import BannerUseOfZusd from "@components/Banner/BannerUseOfZusd";
import "./styles.css"
import GridCrad from "@components/Banner/GridCrad";
import mintBg from "@assets/bgs/hzn.png";
import { useAtomValue } from "jotai/utils";
import { hasRewardsAtom } from "@atoms/feePool";
import { useHistory } from "react-router-dom";

const gridCards: GridCardProps[] = [
  {
    titleColor: PAGE_COLOR.mint,
    icon: '',
    title: 'Mint',
    desc: <>Stake HZN to mint zUSD and<br />earn 194.14% APY</>,
  },
  {
    titleColor: PAGE_COLOR.burn,
    icon: '',
    title: 'Burn',
    desc: <>Burn zUSD to unstake HZN and<br />increase your C-Ratio</>,
  },
  {
    titleColor: COLOR.text,
    icon: '',
    title: 'Claim',
    desc: <>Claim your weekly staking and<br />exchange rewards</>,
  },
  {
    titleColor: COLOR.text,
    icon: '',
    title: 'Trade',
    desc: <>Trade between zAssets on<br />Horizon Exchange</>,
  },
  {
    titleColor: COLOR.text,
    icon: '',
    title: 'Earn',
    desc: <>Supply liquidity and stake LPs to<br />earn yield</>,
  },
  {
    titleColor: COLOR.text,
    icon: '',
    title: 'Learn',
    desc: <>Learn what’s under the hood for<br />Horizon Protocol</>,
  },
];

export default function Home() {

  const hasRewards = useAtomValue(hasRewardsAtom);
  const history = useHistory();

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
        autoPlay={true}
        className="home_carousel"
        duration={500}
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
        <BannerStakeReasonRisk
          img={mintBg}
          title="WHAT ARE THE RISKS?"
          desc={<>Staking HZN, and minting zUSD, will allow you to <br />earn staking rewards from the protocol as well as <br />a split of the zUSD transaction fees generated on <br />Horizon Exchange.  HZN staking rewards are <br />currently</>}
          highlightText=" 194.14% APY."
        />
        <BannerUseOfZusd />
        <BannerStakeReasonRisk
          img={mintBg}
          title="WHY STAKE HZN?"
          desc={<>When staking HZN and minting zUSD you are<br />collateralizing the zUSD with HZN at an 800% ratio<br />(C-Ratio). You must maintain this 800% C-Ratio or <br />you cannot claim rewards or you can be potentially<br />liquidated if you reach a 200% C-Ratio.<br /></>}
          highlightText="LEARN MORE"
        />
      </Carousel>
      <Box sx={{
        mt: '30px',
        mb: '50px',
        width: '450px',
        height: '300px',
        flexGrow: 1
      }}>
        <Grid container spacing='2px' columns={12}>
          {gridCards.map((item: GridCardProps,index) => {
            return (
              <Grid item xs={6} sm={6} md={6} key={item.title}>
                <GridCrad onClick={()=>{
                  if (index == 0) history.push("mint")
                  if (index == 1) history.push("burn")
                  if (index == 2) history.push("claim")
                  // if (index == 3) history.push("mint")
                  if (index == 4) history.push("earn")
                  // if (index == 5) history.push("mint")
                }} titleColor={item.titleColor} title={item.title} desc={item.desc} icon={item.icon} showAlert={item.title === "Claim" && hasRewards} />
              </Grid>
            )
          })}
        </Grid>
      </Box>
    </Box >
  );
}