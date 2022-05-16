import { useCallback, useRef, SyntheticEvent } from "react";
import { Box, Link, InputBase, Typography, SvgIcon } from "@mui/material";
import { trimStart } from "lodash";
import NumberFormat from "react-number-format";
import { formatNumber, NumericValue } from "@utils/number";
import { BORDER_COLOR, COLOR } from "@utils/theme/constants";
import { ReactComponent as IconHZN } from "@assets/images/hzn.svg";
import { ReactComponent as IconzUSD } from "@assets/images/zUSD.svg";
import { Token } from "@utils/constants";

declare global {
  interface TokenInputProps {
    disabled?: boolean;
    token: TokenEnum;
    label: string;
    balanceLabel?: JSX.Element | string;
    maxButtonLabel?: JSX.Element | string;
    zUSDBalance?: BN;
    max?: BN;
    color?: string;
    labelColor?: string;
    bgColor?: string;
    input: string;
    inputPrefix?: string;
    onInput(v: string, max?: boolean): void;
    onUserInput?(): void;
    amount: BN; // BN format of input
    invalid?: boolean;
    toPairInput(stakeAmount: NumericValue): string; // convert between from and to token amount
  }
}

export default function TokenInput({
  disabled = false,
  token,
  label,
  input,
  onInput,
  onUserInput,
  amount,
  balanceLabel,
  maxButtonLabel,
  zUSDBalance,
  max,
  color,
  labelColor,
  bgColor,
  inputPrefix,
  invalid = false,
}: TokenInputProps) {
  const maxRef = useRef<boolean>();

  const handleClickMax = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      if (!!max && !amount.eq(max)) {
        onInput(max.toString(), true);
        // when click 2+ times max.
        if (maxRef.current) {
          maxRef.current = false;
        }
      }
    },
    [amount, max, onInput]
  );

  const handleUserInput = useCallback(() => {
    maxRef.current = false;
    onUserInput?.();
  }, [onUserInput]);

  return (
    <Box
      display="flex"
      border={0}
      borderRadius={1}
      borderColor={BORDER_COLOR}
      p="16px 24px"
      py={1}
      px={{
        xs: 1,
        sm: 3,
      }}
      bgcolor={"rgba(16, 38, 55, 0.4)"}
    >
      <Box display="flex" alignItems="center">
        {/* <TokenLogo token={token} logo={logo} /> */}
        <SvgIcon
          sx={{
            width: {
              xs:'30px',
              md:'50px'
            },
            height: {
              xs:'30px',
              md:'50px'
            }
          }}
        >
          {token == Token.HZN ? <IconHZN/> : <IconzUSD/>}
        </SvgIcon>
        <Box display="flex" flexDirection="column" p="10px 12px" fontSize={24}>
          <Typography
            fontSize={{
              xs:'10px',
              md:'12px'
            }}
            letterSpacing="0.5px"
            lineHeight="14px"
            color={labelColor}
          >
            {label}
          </Typography>
          <Typography
            color={COLOR.text}
            fontSize={{
              xs: 18,
              sm: 24,
            }}
            fontWeight={700}
            letterSpacing="1px"
            lineHeight="28px"
          >
            {token}
          </Typography>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" flexGrow={1} flexShrink={1}>
        <NumberFormat
          value={input}
          onValueChange={(values) => {
            // WARN: to avoid infinite loop
            // console.log("onValueChange", {
            //   maxRef: maxRef.current,
            //   label,
            //   input,
            //   values,
            // });
            if (input !== values.value) {
              onInput(trimStart(values.value, "."), maxRef.current);
            }
            maxRef.current = false;
          }}
          // onChange fires after onValue change if user input
          onChange={handleUserInput}
          prefix={inputPrefix}
          allowNegative={false}
          thousandSeparator
          isNumericString
          placeholder="0.0"
          disabled={disabled}
          customInput={InputBase}
          inputProps={{
            inputMode: "decimal",
          }}
          // decimalScale={3}
          sx={{
            ".MuiInputBase-input": {
              color: invalid ? COLOR.danger : COLOR.text,
              fontFamily: "Rawline",
              fontSize: {
                xs: 20,
                md: 24
              },
              fontWeight: 700,
              lineHeight: "28px",
              textAlign: "right",
              height: "28px",
              padding: "8px 0 2px 0",
              "&.Mui-disabled": {
                WebkitTextFillColor: "initial",
              },
            },
          }}
        />
        <Box
          display="flex"
          justifyContent="flex-end"
          flexWrap={{
            xs: "wrap",
            md: "nowrap",
          }}
        >
          <Typography
            component="span"
            fontSize={12}
            fontWeight={400}
            letterSpacing={0.5}
            color="#6E89A6"
          >
            {balanceLabel
              ? balanceLabel
              : zUSDBalance
              ? `Balance: ${formatNumber(zUSDBalance)} ${token}`
              : ""}
          </Typography>
          {maxButtonLabel && max?.gt(0) ? (
            <Link
              href="#"
              underline="none"
              color="inherit"
              onClick={handleClickMax}
              sx={{
                p: "0 0 0 4px",
                fontSize: 12,
                fontWeight: 700,
                textTransform: "none",
                color,
              }}
            >
              ({maxButtonLabel})
            </Link>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}
