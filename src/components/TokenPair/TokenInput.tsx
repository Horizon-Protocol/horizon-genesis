import { useCallback, useRef, SyntheticEvent, useMemo } from "react";
import { formatEther } from "@ethersproject/units";
import { Box, Link, InputBase, Typography, LinkProps } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import NumberFormat from "react-number-format";
import { BigNumber, constants } from "ethers";
import { Token, TokenName } from "@utils/constants";
import { formatBalance } from "@utils/formatters";
import { BORDER_COLOR } from "@utils/theme/constants";
import hznLogo from "@assets/tokens/hzn.png";

declare global {
  interface TokenInputProps {
    token: Token.HZN | zAssetsEnum;
    label: string;
    balanceLabel?: JSX.Element | string;
    maxButtonLabel?: JSX.Element | string;
    max?: BigNumber;
    color?: string;
    bgColor?: string;
    logo?: string;
    input: string;
    onInput(v: string, max?: boolean): void;
    amount: BigNumber; // ehter BN format of input
  }
}

const useStyles = makeStyles(({ palette }) => ({
  root: {
    padding: "16px 24px",
    background: "#091320",
  },
  inputBox: {},
  tokenLogo: {
    background: "rgba(55,133,185,0.08)",
    textAlign: "center",
  },
  logoLabel: {
    marginTop: 4,
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "1.08px",
    transform: "scale(0.75)",
  },
  tokenNameTip: {
    fontSize: 12,
    letterSpacing: "0.43px",
    lineHeight: "14px",
  },
  tokenName: {
    color: "#B4E0FF",
    fontSize: 24,
    fontWeight: 700,
    letterSpacing: "0.86px",
    lineHeight: "28px",
  },
  label: {
    padding: 12,
    display: " inline-flex",
    alignItems: "center",
  },
  inputLabel: {
    padding: "10px 12px",
    fontSize: 24,
  },
  input: {},
  innerInput: {
    // fontFamily: "Rawline",
    color: ({ invalidInput = false }: { invalidInput: boolean }) =>
      invalidInput ? "red" : "#B4E0FF",
    fontSize: 24,
    fontWeight: 700,
    lineHeight: " 29px",
    textAlign: "right",
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: "#6E89A6",
  },
  balanceLabelError: {
    color: "red",
  },
  maxButton: {
    padding: "0 0 0 4px",
    fontSize: 12,
    fontWeight: 700,
    textTransform: "none",
  },
}));

export default function TokenInput({
  token,
  label,
  input,
  onInput,
  amount,
  balanceLabel = "Balance:",
  maxButtonLabel,
  max,
  logo,
  color,
  bgColor,
}: TokenInputProps) {
  const classes = useStyles({
    invalidInput: BigNumber.isBigNumber(max) && amount.gt(max),
  });

  const maxRef = useRef<boolean>();

  const handleClickMax = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      if (BigNumber.isBigNumber(max) && !amount.eq(max)) {
        maxRef.current = true;

        onInput(formatBalance(max, { mantissa: 6, trimMantissa: true }), true);
      }
    },
    [amount, max, onInput]
  );

  const isHZN = token === Token.HZN;

  return (
    <Box
      display='flex'
      border={1}
      borderRadius={4}
      borderColor={BORDER_COLOR}
      className={classes.root}
      style={{ backgroundColor: bgColor }}
    >
      <Box display='flex' alignItems='center'>
        <Box
          width={50}
          height={50}
          display='flex'
          flexDirection='column'
          justifyContent='center'
          alignItems='center'
          borderRadius='50%'
          className={classes.tokenLogo}
        >
          <img
            src={logo || hznLogo}
            alt={token}
            style={{
              width: isHZN ? 26 : 18,
              height: isHZN ? 26 : 18,
            }}
          />
          {!isHZN && <span className={classes.logoLabel}>{token}</span>}
        </Box>
        <Box
          display='flex'
          flexDirection='column'
          className={classes.inputLabel}
        >
          <Typography className={classes.tokenNameTip}>{label}</Typography>
          <Typography className={classes.tokenName}>{token}</Typography>
        </Box>
      </Box>
      <Box
        display='flex'
        flexDirection='column'
        flexGrow={1}
        flexShrink={1}
        className={classes.inputBox}
      >
        <NumberFormat
          value={input}
          onValueChange={(values) => {
            onInput(values.value, maxRef.current);
            maxRef.current = false;
          }}
          allowNegative={false}
          thousandSeparator
          isNumericString
          placeholder='0.0'
          customInput={InputBase}
          className={classes.input}
          classes={{ input: classes.innerInput }}
        />
        <Box display='flex' justifyContent='flex-end'>
          <Typography
            classes={{
              root: classes.balanceLabel,
              colorError: classes.balanceLabelError,
            }}
            // className={classes.balanceLabel}
          >
            {balanceLabel}
            {BigNumber.isBigNumber(max)
              ? ` ${formatBalance(max)} ${token}`
              : ""}
          </Typography>
          {max?.gt(0) && (
            <Link
              href='#'
              underline='none'
              color='inherit'
              onClick={handleClickMax}
              classes={{ root: classes.maxButton }}
              style={{ color: color }}
            >
              ({maxButtonLabel})
            </Link>
          )}
        </Box>
      </Box>
    </Box>
  );
}
