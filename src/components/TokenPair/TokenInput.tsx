import { useCallback, useRef, SyntheticEvent } from "react";
import { Box, Link, InputBase, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import NumberFormat from "react-number-format";
import { formatNumber, NumericValue } from "@utils/number";
import { BORDER_COLOR } from "@utils/theme/constants";
import TokenLogo from "@components/TokenLogo";

declare global {
  interface TokenInputProps {
    token: TokenEnum | zAssetsEnum;
    label: string;
    balanceLabel?: JSX.Element | string;
    maxButtonLabel?: JSX.Element | string;
    max: BN;
    color?: string;
    labelColor?: string;
    bgColor?: string;
    logo?: string;
    input: string;
    inputPrefix?: string;
    onInput(v: string, max?: boolean): void;
    amount: BN; // BN format of input
    toPairInput(stakeAmount: NumericValue): string; // convert between from and to token amount
  }
}

const useStyles = makeStyles(({ palette }) => ({
  root: {
    padding: "16px 24px",
    background: "#091320",
  },
  inputBox: {},
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
    fontFamily: "Rawline",
    fontSize: 24,
    fontWeight: 700,
    lineHeight: "26px",
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
  labelColor,
  bgColor,
  inputPrefix,
}: TokenInputProps) {
  const classes = useStyles({
    invalidInput: amount.gt(max),
  });

  console.log("input", label, input);

  const maxRef = useRef<boolean>();

  const handleClickMax = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      if (max && !amount.eq(max)) {
        maxRef.current = true;
        onInput(max.toString(), true);
      }
    },
    [amount, max, onInput]
  );

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
        <TokenLogo token={token} logo={logo} />
        <Box
          display='flex'
          flexDirection='column'
          className={classes.inputLabel}
        >
          <Typography
            className={classes.tokenNameTip}
            style={{ color: labelColor }}
          >
            {label}
          </Typography>
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
            // WARN: to avoid infinite loop
            console.log("onCalueChange", input, values);
            if (input !== values.value) {
              onInput(values.value, maxRef.current);
              maxRef.current = false;
            }
          }}
          prefix={inputPrefix}
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
            {balanceLabel} {formatNumber(max)} {token}
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
