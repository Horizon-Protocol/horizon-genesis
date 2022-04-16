import { Box, Button, Typography } from "@mui/material";
import { COLOR, PAGE_COLOR } from "@utils/theme/constants";
import PrimaryButton from "@components/PrimaryButton";
import mintBg from "@assets/images/slidemint.png";
import { useHistory } from "react-router-dom";
import { HZNBuyLink } from "@utils/constants";
import useIsMobile from "@hooks/useIsMobile";
import { useUpdateAtom } from "jotai/utils";
import { footerMenuGetHZNOpenAtom } from "@atoms/app";

export default function BannerMint() {
  const updateGetHZNOpen = useUpdateAtom(footerMenuGetHZNOpenAtom)

  const history = useHistory()
  return (
    <Box
      height='220px'
      width='100%'
      // bgcolor='blue'
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      sx={{
        backgroundImage: mintBg && `url(${mintBg})`,
        backgroundSize: "auto 100%",
        backgroundPositionX: 'center',
        backgroundRepeat: "no-repeat",
      }}
      px={{
        xs: 3,
        sm: 3,
      }}
    >
      <Typography
        marginTop='20px'
        component='div'
        textAlign='center'
        fontSize={{
          xs: '28px',
          sm: '38px',
        }}
        color='#fff'
        fontWeight='400'
        variant="h5"
        fontFamily='Raleway'
        lineHeight={{
          xs: '33px',
          sm: '42px'
        }}
        letterSpacing={2}
      >
        <span style={{
          color: PAGE_COLOR.mint,
          fontWeight: 'bold'
        }}>MINT </span>
        SYNTHETIC ASSETS AND <span style={{
          color: PAGE_COLOR.mint,
          fontWeight: 'bold'
        }}>EARN</span> REWARDS
      </Typography>
      <Typography
        textAlign='center'
        fontSize={{
          xs: 14,
          sm: 14
        }}
        lineHeight={{
          xs: '21px',
          sm: '16px',
        }}
        fontWeight='normal'
        fontFamily='Raleway'
        letterSpacing={1}
        mt={{
          xs: '6px',
          md: '10px'
        }}
        width={{
          sm:'100%',
          md:'70%'
        }}
        color='rgba(180, 224, 255, 0.75)'
      >
        Stake HZN to mint zUSD (a USD stablecoin) and earn rewards.
      </Typography>
      <Box sx={{ display: 'flex' }}>
        <PrimaryButton
          sx={{
            letterSpacing: '2px',
            borderRadius: '2px',
            fontSize: {
              xs: 10,
              md: 12,
            },
            height: {
              xs: 28,
              md: 36,
            },
            width: {
              xs: 122,
              md: 138,
            },
            mt: '20px'
          }}
          onClick={() => {
            history.push('mint')
          }}
        >
          STAKE NOW
        </PrimaryButton>
        {/* <ActionLink underline="none" showArrow={false} href={HZNBuyLink} target='_blank'> */}
        <PrimaryButton
          onClick={() => {
            updateGetHZNOpen(true)
          }}
          sx={{
            letterSpacing: '2px',
            borderRadius: '2px',
            fontSize: '12px',
            ml: '10px',
            backgroundColor: "transparent",
            border: `1px solid ${COLOR.safe}`,
            color: COLOR.safe,
            height: {
              xs: 28,
              md: 36,
            },
            width: {
              xs: 122,
              md: 138,
            },
            mt: '20px',
            ":hover": {
              color: '#1E1F25',
              backgroundColor: 'rgba(42, 212, 183, 1)'
            }
          }}
        >
          GET HZN
        </PrimaryButton>
        {/* </ActionLink> */}
      </Box>
    </Box>
  );
}
