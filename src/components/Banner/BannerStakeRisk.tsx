import { Box, Typography } from "@mui/material";
import { PAGE_COLOR } from "@utils/theme/constants";
import information from "@assets/images/information.png";
import { ratiosPercentAtom } from "@atoms/app";
import { useAtomValue } from "jotai";
import { styled } from "@mui/material/styles";

const Img = styled("img")``;

export default function BannerStakeRisk() {
  const { targetCRatioPercent } = useAtomValue(ratiosPercentAtom);

  return (
    <Box
    height='207px'
    width='100%'
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
    >
      <Img
    src={information}
    sx={{
      width: "54px",
      height: "54px",
    }}
  />
      <Typography
        textAlign='center'
        fontSize={14}
        fontWeight='bold'
        lineHeight='16px'
        fontFamily='Raleway'
        letterSpacing={1}
        mt='14px'
      >
        WHAT ARE THE RISKS?
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
        <>When staking HZN and minting zUSD you are<br />collateralizing the zUSD with HZN at an {targetCRatioPercent}% ratio<br />(C-Ratio). You must maintain this {targetCRatioPercent}% C-Ratio or <br />you cannot claim rewards or you can be potentially<br />liquidated if you reach a 200% C-Ratio.<br /></>
        <Box component='span'
         onClick={() => {
    window.open("https://docs.horizonprotocol.com/");
  }}
        sx={{
          fontSize: 13,
          fontWeight: 'bold',
          color: PAGE_COLOR.mint,
          cursor: 'pointer'
        }}
        >LEARN MORE</Box>
      </Typography>
    </Box>
  );
}
