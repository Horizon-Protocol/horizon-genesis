import { Box, Button, Typography } from "@mui/material";
import { color } from "@mui/system";
import { PAGE_COLOR } from "@utils/theme/constants";
import PrimaryButton from "@components/PrimaryButton";
import mintBg from "@assets/bgs/hzn.png";

export default function BannerMint() {
  return (
    <Box
      height='240px'
      width='100%'
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      bgcolor='red'
      style={{
        background: `url(${mintBg}) no-repeat`,
        backgroundSize: "100% 100%",
      }}
    >
      <Typography
        component='div'
        textAlign='center'
        fontSize={34}
        fontWeight='bold'
        fontFamily='Raleway'
        lineHeight='40px'
        letterSpacing={2}
      >
        <span style={{
          fontSize: 34,
          color: PAGE_COLOR.mint
        }}>MINT </span>
        SYNTHETIC ASSETS<br/>AND <span style={{
          fontSize: 34,
          color: PAGE_COLOR.mint
        }}>EARN</span> REWARDS
      </Typography>
      <Typography
        textAlign='center'
        fontSize={12}
        fontWeight='normal'
        lineHeight='16px'
        fontFamily='Raleway'
        letterSpacing={1}
        mt='14px'
      >
        Stake HZN to mint zUSD (a USD stablecoin) and <br/>earn rewards.
      </Typography>
      <PrimaryButton
        size='large'
        fullWidth
        sx={{
          height: 28,
          width: 122,
          mt: '13px'
        }}
      // onClick={handleClaim}
      >
        MINT NOW
      </PrimaryButton>
    </Box>
  );
}
