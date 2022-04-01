import { Box, Grid, Typography } from "@mui/material";
import {  useCallback, useEffect } from "react";
import { COLOR, PAGE_COLOR } from "@utils/theme/constants";
// import "./styles.css"
import GridCrad from "@components/Banner/GridCrad";
import { useAtomValue } from "jotai/utils";
import { hasRewardsAtom } from "@atoms/feePool";
import { LINK_EXCHANGE } from "@utils/constants";
import gridMint from "@assets/images/grid-mint.png";
import { useHistory } from "react-router-dom";
import useUserStakingData from "@hooks/useUserStakingData";
import TopCarousel from "./TopCarousel";

const gridCards: GridCardProps[] = [
  {
    titleColor: PAGE_COLOR.mint,
    icon: gridMint,
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
  const { stakingAPR } = useUserStakingData();

  useEffect(() => {

  }, []);

  // const TopCarousel = useCallback(() => {
  //   return (
      
  //   )
  // }, [])

  return (
    <Box
      mx='auto'
      maxWidth={640}
      position={"relative"}
      // bgcolor='green'
      bgcolor='rgba(16,38,55,0.3)'
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      py={{
        xs: 1,
        sm: 3
      }}
    >
      <TopCarousel />
      <Box
        px={{
          xm: 1,
          sm: '90px'
        }}
        sx={{
          mt: '30px',
          mb: '50px',
          width: '100%',
          height: '300px',
          flexGrow: 1,
        }}>
        <Grid container spacing='2px' columns={12}>
          {gridCards.map((item: GridCardProps, index) => {
            return (
              <Grid item xs={6} sm={6} md={6} key={item.title}>
                <GridCrad onClick={() => {
                  if (index == 0) history.push("mint")
                  if (index == 1) history.push("burn")
                  if (index == 2) history.push("claim")
                  if (index == 3) window.open(LINK_EXCHANGE)
                  if (index == 4) history.push("earn")
                  if (index == 5) window.open("https://docs.horizonprotocol.com/");
                }} titleColor={item.titleColor} title={item.title} desc={item.desc} icon={item.icon} showAlert={item.title === "Claim" && hasRewards} />
              </Grid>
            )
          })}
        </Grid>
      </Box>
    </Box >
  );
}