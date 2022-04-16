import { Box, BoxProps, SvgIcon } from "@mui/material";
import { COLOR, BORDER_COLOR } from "@utils/theme/constants";
import { formatNumber, zeroBN } from "@utils/number";
import { Token } from "@utils/constants";

interface Props {
  label: string | JSX.Element;
  amount: BN;
  token?: string;
  disabled?: boolean;
  help?: string | JSX.Element;
  upcoming?: boolean;
  svg?: JSX.Element;
}

export default function RewardCard({
  label = "reward",
  amount,
  token = Token.HZN,
  disabled,
  help,
  upcoming = false,
  svg,
  ...props
}: Props & BoxProps) {
  return (
    <Box
      width="49%"
      bgcolor={COLOR.bgColor}
      position="relative"
      borderRadius='4px'
      {...props}
    >
      <Box
        height="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        borderColor={BORDER_COLOR}
        sx={{
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {!upcoming && <SvgIcon
          sx={{
            width: {
              xs:'30px',
              md:'32px'
            },
            height: {
              xs:'30px',
              md:'32px'
            }
          }}
        >
          {svg}
        </SvgIcon>}
        <Box
          component="span"
          mt="5px"
          color="#88ABC3"
          textAlign="center"
          fontSize={{
            xs:10,
            md:12
          }}
          letterSpacing="0.43px"
          lineHeight="14px"
        >
          {label}
        </Box>
        <Box
          mt="1px"
          component="span"
          fontFamily="Rawline"
          color={
            upcoming
              ? "white"
              : amount.isGreaterThan(zeroBN)
                ? COLOR.safe
                : "white"
          }
          fontSize={upcoming ? 18 : 24}
          fontWeight={700}
          letterSpacing="0.86px"
          lineHeight="28px"
          textAlign="center"
        >
          {formatNumber(amount)}
          <Box
          component='span'
            sx={{
              marginLeft: "4px",
              fontSize: {
                xs:'12px',
                md:"16px"
              },
              color: COLOR.text,
              opacity: 0.5,
              fontWeight: "normal",
            }}
          >
            {token}
          </Box>
        </Box>
      </Box>
      {help ? (
        <Box
          position="absolute"
          left={0}
          right={0}
          bottom={14}
          color={COLOR.safe}
          fontSize={10}
          fontWeight={300}
          letterSpacing="0.36px"
          lineHeight="14px"
          textAlign="center"
          whiteSpace="pre-line"
        >
          {help}
        </Box>
      ) : null}
    </Box>
  );
}
