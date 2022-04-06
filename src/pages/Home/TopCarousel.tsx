
import { Box, Grid, Typography } from "@mui/material";
import Carousel from 'react-material-ui-carousel'
import navNext from "@assets/images/next.png";
import navPre from "@assets/images/pre.png";
import BannerMint from "@components/Banner/BannerMint";
import BannerStakeReasonRisk from "@components/Banner/BannerStakeReasonRisk";
import BannerUseOfZusd from "@components/Banner/BannerUseOfZusd";
import information from "@assets/images/information.png";
import hznIcon from "@assets/images/icon-hzn.png";
import gridMint from "@assets/images/grid-mint.png";
import { formatNumber } from "@utils/number";
import { styled } from "@mui/material/styles";
import { useHistory } from "react-router-dom";
import zusdIcon from "@assets/images/zUSD-icon.png";
import { COLOR, PAGE_COLOR } from "@utils/theme/constants";
import { memo, useEffect } from "react";

const Img = styled("img")``;

const TopCarousel = () => {
    
    useEffect(()=>{
        console.log('refresh carousel')
    },[])

    return (
        <Box
        px={{
          xs: 1,
          sm: '40px',
        }}
        sx={{
          height: '271px',
          width: '100%',
        }}>
        <Carousel
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
              marginTop: '-50px',
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
              textAlign: 'center'
            }
          }}
        >
          <BannerMint />
          <BannerStakeReasonRisk
            img={<Box sx={{
              mb: '15px',
              display: 'flex',
              alignItems: 'flex-end',
            }}>
              <Img
                src={hznIcon}
                sx={{
                  mr: '10px',
                  width: "32px",
                  height: "32px",
                  mb: '-13px',
                }}
              />
              <Img
                src={gridMint}
                sx={{
                  width: "60px",
                  height: "53px",
                }}
              />
              <Img
                src={zusdIcon}
                sx={{
                  ml: '10px',
                  width: "32px",
                  height: "32px",
                  mb: '-13px',
                }}
              />
            </Box>}
            title="WHY STAKE HZN?"
            desc={<>Staking HZN, and minting zUSD, will allow you to <br />earn staking rewards from the protocol as well as <br />a split of the zUSD transaction fees generated on <br />Horizon Exchange.  HZN staking rewards are <br />currently</>}
            // highlightText={stakingAPR * 100 ? ` ${formatNumber(stakingAPR * 100)}% APY` : "--"}
          />
          <BannerUseOfZusd />
          <BannerStakeReasonRisk
            img={<Img
              src={information}
              sx={{
                width: "54px",
                height: "54px",
              }}
            />}
            title="WHAT ARE THE RISKS?"
            desc={<>When staking HZN and minting zUSD you are<br />collateralizing the zUSD with HZN at an 800% ratio<br />(C-Ratio). You must maintain this 800% C-Ratio or <br />you cannot claim rewards or you can be potentially<br />liquidated if you reach a 200% C-Ratio.<br /></>}
            highlightText="LEARN MORE"
            style={{
              cursor: 'pointer'
            }}
            onClick={() => {
              window.open("https://docs.horizonprotocol.com/");
            }}
          />
        </Carousel>
      </Box>
    )
}

export default memo(TopCarousel)