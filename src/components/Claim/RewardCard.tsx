import { Box, BoxProps } from "@mui/material";
import TokenLogo from "@components/TokenLogo";
import { COLOR, BORDER_COLOR } from "@utils/theme/constants";
import { formatNumber, zeroBN } from "@utils/number";
import { Token } from "@utils/constants";

interface Props {
  label: string | JSX.Element;
  amount: BN;
  token?: TokenEnum | zAssetsEnum;
  disabled?: boolean;
  help?: string | JSX.Element;
  upcoming?: boolean;
}

export default function RewardCard({
  label = "reward",
  amount,
  token = Token.HZN,
  disabled,
  help,
  className,
  upcoming = false,
  ...props
}: Props & BoxProps) {
  return (
    <Box
      width='49%'
      bgcolor={COLOR.bgColor}
      height={123}
      position='relative'
      {...props}
    >
      <Box
        height='100%'
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        borderColor={BORDER_COLOR}
        sx={{
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {!upcoming && <TokenLogo token={token} />}
        <Box
          component='span'
          mt="5px"
          color='#88ABC3'
          textAlign="center"
          fontSize={12}
          letterSpacing='0.43px'
          lineHeight='14px'
        >
          {label}
        </Box>
        <Box
          mt="1px"
          component='span'
          fontFamily='Rawline'
          color={upcoming ? "white" : amount.isGreaterThan(zeroBN) ? COLOR.safe : "white"}
          fontSize={upcoming ? 18 : 24}
          fontWeight={700}
          letterSpacing='0.86px'
          lineHeight='28px'
          textAlign='center'
        >
          {formatNumber(amount)}<span style={{marginLeft:"4px", fontSize:"16px", color:COLOR.text, opacity:.5, fontWeight:"normal"}}>{token}</span>
        </Box>
      </Box>
      {help ? (
        <Box
          position='absolute'
          left={0}
          right={0}
          bottom={14}
          color={COLOR.safe}
          fontSize={10}
          fontWeight={300}
          letterSpacing='0.36px'
          lineHeight='14px'
          textAlign='center'
          whiteSpace='pre-line'
        >
          {help}
        </Box>
      ) : null}
    </Box>
  );
}
