import { Box, BoxProps } from "@mui/material";
import TokenLogo from "@components/TokenLogo";
import { COLOR, BORDER_COLOR } from "@utils/theme/constants";
import { formatNumber } from "@utils/number";
import { Token } from "@utils/constants";

interface Props {
  label: string;
  amount: BN;
  token?: TokenEnum | zAssetsEnum;
  disabled?: boolean;
  help?: string | JSX.Element;
}

export default function RewardCard({
  label = "reward",
  amount,
  token = Token.HZN,
  disabled,
  help,
  className,
  ...props
}: Props & BoxProps) {
  return (
    <Box
      width='50%'
      maxWidth={225}
      height={244}
      position='relative'
      bgcolor='#0C111D'
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
        <TokenLogo token={token} />
        <Box
          component='span'
          my={1}
          color='#88ABC3'
          fontSize={12}
          letterSpacing='0.43px'
          lineHeight='14px'
        >
          {label}
        </Box>
        <Box
          component='span'
          fontFamily='Rawline'
          color={COLOR.text}
          fontSize={24}
          fontWeight={700}
          letterSpacing='0.86px'
          lineHeight='28px'
          textAlign='center'
        >
          {formatNumber(amount)}
          <br />
          {token}
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
