
import { Box } from "@mui/material";
import Carousel from 'react-material-ui-carousel'
import navNext from "@assets/images/next.png";
import navPre from "@assets/images/pre.png";
import BannerMint from "@components/Banner/BannerMint";
import BannerUseOfZusd from "@components/Banner/BannerUseOfZusd";
import { styled } from "@mui/material/styles";
import { PAGE_COLOR } from "@utils/theme/constants";
import { memo, useEffect } from "react";
import BannerStakeReason from "@components/Banner/BannerStakeReason";
import BannerStakeRisk from "@components/Banner/BannerStakeRisk";
import useIsMobile from "@hooks/useIsMobile";

const Img = styled("img")``;

const TopCarousel = () => {
  const isMobile = useIsMobile()

  return (
    <Box
      px={{
        xs: 1,
        sm: '40px',
      }}
      sx={{
        // height: '207px',
        width: '100%',
        // backgroundColor:'red'
      }}>
      <Carousel
        height='220px'
        animation="fade"
        autoPlay={false}
        duration={500}
        navButtonsAlwaysVisible={true}
        NextIcon={<img src={navNext}></img>}
        PrevIcon={<img src={navPre}></img>}
        navButtonsProps={{          // Change the colors and radius of the actual buttons. THIS STYLES BOTH BUTTONS
          style: {
            backgroundColor: 'transparent',
            borderRadius: 0
          }
        }}
        IndicatorIcon={
          <Box sx={{ width: "5px", height: '5px' }}></Box>
        }
        indicatorIconButtonProps={{
          style: {
            opacity: .5,
            backgroundColor: PAGE_COLOR.mint,
            marginLeft: '10px',
          }
        }}
        activeIndicatorIconButtonProps={{
          style: {
            opacity: 1,
            marginLeft: '10px',
            backgroundColor: PAGE_COLOR.mint,
          }
        }}
        indicatorContainerProps={{
          style: {
            marginTop: isMobile ? 20: 2,
            textAlign: 'center',
            // lineHeight: '38px',
            // backgroundColor:'green'
          }
        }}
      >
        <BannerMint/>
        <BannerStakeReason/>
        <BannerUseOfZusd/>
        <BannerStakeRisk/>
      </Carousel>
    </Box>
  )
}

export default memo(TopCarousel)