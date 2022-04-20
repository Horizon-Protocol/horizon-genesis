import { Box, BoxProps, Button, Typography } from "@mui/material";
import { PAGE_COLOR } from "@utils/theme/constants";
import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as IconMint } from "@assets/images/mint.svg";
import { ReactComponent as IconHZN } from "@assets/images/hzn.svg";
import { ReactComponent as IconzUSD } from "@assets/images/zUSD.svg";
import useUserStakingData from "@hooks/useUserStakingData";
import { formatNumber } from "@utils/number";

export default function BannerStakeReason() {
  const { stakingAPR, isEstimateAPR } = useUserStakingData();

  return (
    <Box
    height='207px'
    width='100%'
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
    >
      <Box sx={{
    mb: '15px',
    display: 'flex',
    alignItems: 'flex-end',
  }}>
    <SvgIcon
      sx={{
        mr: '10px',
        width: "32px",
        height: "32px",
        mb: '-13px',
      }}
    >
      <IconHZN />
    </SvgIcon>
    <SvgIcon
      sx={{
        width: "60px",
        height: "53px",
      }}
    >
      <IconMint />
    </SvgIcon>
    <SvgIcon
      sx={{
        ml: '10px',
        width: "32px",
        height: "32px",
        mb: '-13px',
      }}
    >
      <IconzUSD />
    </SvgIcon>
  </Box>
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
        fontSize={14}
        fontWeight='normal'
        fontFamily='Rawline'
        lineHeight='19px'
        letterSpacing={1}
        color='rgba(180, 224, 255, 0.75)'
        sx={{
          mt:'10px'
        }}
      >
        {<>Staking HZN, and minting zUSD, will allow you to <br />earn staking rewards from the protocol as well as <br />a split of the zUSD transaction fees generated on <br />Horizon Exchange.  HZN staking rewards are <br />currently</>}
        <Box component='span' sx={{
          fontSize: 13,
          fontWeight: 'bold',
          color: PAGE_COLOR.mint,
        }}
        > {stakingAPR * 100 && isEstimateAPR ? '≈' : null}
        <span>{stakingAPR * 100 ? formatNumber(stakingAPR * 100) : "--"}</span>% APY</Box>
      </Typography>
    </Box>
  );
}
