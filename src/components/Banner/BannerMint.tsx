import { Box, Button, Typography } from "@mui/material";
import { color } from "@mui/system";
import { COLOR, PAGE_COLOR } from "@utils/theme/constants";
import PrimaryButton from "@components/PrimaryButton";
import mintBg from "@assets/bgs/hzn.png";
import { useHistory } from "react-router-dom";
import { HZNBuyLink } from "@utils/constants";
import ActionLink from "@components/Alerts/ActionLink";

export default function BannerMint() {

  const history = useHistory()

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
      px={{
        xs: 7,
        sm: 3,
      }}
    >
      <Typography
        component='div'
        textAlign='center'
        fontSize={{
          xs: '20px',
          sm: '34px',
        }}
        fontWeight='bold'
        variant="h5"
        fontFamily='Raleway'
        lineHeight='4opx'
        letterSpacing={2}
      >
        <span style={{
          color: PAGE_COLOR.mint
        }}>MINT </span>
        SYNTHETIC ASSETS<br/>AND <span style={{
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
        mt='4px'
      >
        Stake HZN to mint zUSD (a USD stablecoin) and <br/>earn rewards.
      </Typography>
      <Box sx={{display:'flex'}}>
      <PrimaryButton
        size='large'
        fullWidth
        sx={{
          height: 28,
          width: 122,
          mt: '13px'
        }}
        onClick={()=>{
          history.push('mint')
        }}
      >
        MINT NOW
      </PrimaryButton>
      <ActionLink showArrow={false} href={HZNBuyLink} target='_blank'>
        <PrimaryButton
          size='large'
          fullWidth
          sx={{
            ml: '10px',
            backgroundColor:"transparent",
            border: `1px solid ${COLOR.safe}`,
            color: COLOR.safe,
            height: 28,
            width: 122,
            mt: '13px'
          }}
        >
          GET HZN
        </PrimaryButton>
      </ActionLink>
      </Box>
      
    </Box>
  );
}
