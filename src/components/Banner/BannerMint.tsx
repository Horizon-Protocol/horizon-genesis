import { Box, Button, Typography } from "@mui/material";
import { COLOR, PAGE_COLOR } from "@utils/theme/constants";
import PrimaryButton from "@components/PrimaryButton";
import mintBg from "@assets/images/slidemint.png";
import { useHistory } from "react-router-dom";
import { HZNBuyLink } from "@utils/constants";
import ActionLink from "@components/Alerts/ActionLink";

export default function BannerMint() {

  const history = useHistory()

  return (
    <Box
      height='207px'
      width='100%'
      // bgcolor='blue'
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      sx={{
        backgroundImage: mintBg && `url(${mintBg})`,
        backgroundSize: "auto 100%",
        backgroundPositionX:'center',
        backgroundRepeat: "no-repeat",
      }}
      px={{
        xs: 7,
        sm: 3,
      }}
    >
      <Typography
        marginTop='20px'
        component='div'
        textAlign='center'
        fontSize={{
          xs: '20px',
          sm: '36px',
        }}
        color='#fff'
        fontWeight='400'
        variant="h5"
        fontFamily='Raleway'
        lineHeight='42px'
        letterSpacing={2}
      >
        <span style={{
          color: PAGE_COLOR.mint,
          fontWeight: 'bold'
        }}>MINT </span>
        SYNTHETIC ASSETS<br />AND <span style={{
          color: PAGE_COLOR.mint,
          fontWeight: 'bold'
        }}>EARN</span> REWARDS
      </Typography>
      <Typography
        textAlign='center'
        fontSize={14}
        fontWeight='normal'
        lineHeight='16px'
        fontFamily='Raleway'
        letterSpacing={1}
        mt='4px'
        color='rgba(180, 224, 255, 0.75)'
      >
        Stake HZN to mint zUSD (a USD stablecoin) and <br />earn rewards.
      </Typography>
      <Box sx={{ display: 'flex' }}>
        <PrimaryButton
          sx={{
            letterSpacing: '1px',
            borderRadius: '2px',
            fontSize: '12px',
            height: 28,
            width: 122,
            mt: '20px'
          }}
          onClick={() => {
            history.push('mint')
          }}
        >
          MINT NOW
        </PrimaryButton>
        <ActionLink underline="none" showArrow={false} href={HZNBuyLink} target='_blank'>
          <PrimaryButton
            sx={{
              letterSpacing: '1px',
              borderRadius: '2px',
              fontSize: '12px',
              ml: '10px',
              backgroundColor: "transparent",
              border: `1px solid ${COLOR.safe}`,
              color: COLOR.safe,
              height: 28,
              width: 122,
              mt: '20px',
              ":hover":{
                color:'#1E1F25',
                backgroundColor: 'rgba(42, 212, 183, 1)'
              }
            }}
          >
            GET HZN
          </PrimaryButton>
        </ActionLink>
      </Box>

    </Box>
  );
}
