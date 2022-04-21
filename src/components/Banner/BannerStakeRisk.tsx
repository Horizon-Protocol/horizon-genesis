import { Box, SvgIcon, Typography } from "@mui/material";
import { COLOR, PAGE_COLOR } from "@utils/theme/constants";
import { ratiosPercentAtom } from "@atoms/app";
import { useAtomValue } from "jotai";
import { styled } from "@mui/material/styles";
import { ReactComponent as IconAlert } from "@assets/images/alert.svg";
import ActionLink from "@components/Alerts/ActionLink";

const Img = styled("img")``;

export default function BannerStakeRisk() {
  const { targetCRatioPercent } = useAtomValue(ratiosPercentAtom);

  return (
    <Box
      height='auto'
      width='100%'
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
    >
      <SvgIcon
        sx={{
          width: "54px",
          height: "54px",
        }}
      >
        <IconAlert />
      </SvgIcon>
      <Typography
        textAlign='center'
        fontSize={14}
        fontWeight='bold'
        lineHeight='16px'
        fontFamily='Raleway'
        letterSpacing={1}
        mt='14px'
        color='white'
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
          mt: '10px'
        }}
      >
        <>When staking HZN and minting zUSD you are<br />collateralizing the zUSD with HZN at an {targetCRatioPercent}% ratio<br />(C-Ratio). You must maintain this {targetCRatioPercent}% C-Ratio or <br />you cannot claim rewards or you can be potentially<br />liquidated if you reach a 200% C-Ratio.<br /></>
      </Typography>
      <ActionLink
        href={"https://docs.horizonprotocol.com/"}
        target='_blank'
        showArrow={false}
        sx={{
          marginTop: '10px',
          fontSize: '12px',
          fontWeight: 'bold',
          marginLeft: '7px',
          color: PAGE_COLOR.mint,
          cursor: 'pointer'
        }}
      >
        LEARN MORE
      </ActionLink>
    </Box>
  );
}
