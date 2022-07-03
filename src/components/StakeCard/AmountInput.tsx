import { useCallback, useMemo, useRef } from "react";
import { Box, Button, InputBase, Typography } from "@mui/material";
import NumberFormat from "react-number-format";
import { trimStart } from "lodash";
import prettyMilliseconds from "pretty-ms";
import PrimaryButton from "@components/PrimaryButton";
import { TokenName } from "@utils/constants";
import { formatNumber } from "@utils/number";
import { COLOR } from "@utils/theme/constants";

interface Props {
  token: TokenEnum;
  input?: string;
  onInput: (v: string, max?: boolean) => void;
  amount: BN; // ehter BN format of input
  max: BN;
  lockDownSeconds: number;
  btnLabel: string;
  logo?: string;
  loading: boolean;
  disabled: boolean;
  onSubmit: () => void;
}

export default function AmountInput({
  token,
  input,
  onInput,
  amount,
  max,
  lockDownSeconds,
  btnLabel,
  logo,
  loading = false,
  disabled = false,
  onSubmit,
}: Props) {
  const maxRef = useRef<boolean>();

  const setMax = useCallback(() => {
    if (!amount.eq(max)) {
      maxRef.current = true;
      onInput(formatNumber(max, { mantissa: 6 }), true);
    }
  }, [amount, max, onInput]);

  const lockDownTime = useMemo(
    () =>
      lockDownSeconds
        ? prettyMilliseconds(lockDownSeconds * 1000, {
            verbose: false,
          })
        : null,
    [lockDownSeconds]
  );

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        borderRadius={1.5}
        bgcolor="rgba(16, 38, 55, 0.3)"
        borderColor="divider"
        overflow="hidden"
      >
        <Box
          component="span"
          padding={1.5}
          display=" inline-flex"
          alignItems="center"
          height="51px"
          bgcolor="rgba(16, 38, 55, 0.3)"
        >
          {logo ? (
            <Box component="img" src={logo} alt={""} mr={1} height={22} />
          ) : null}
          <Typography color={COLOR.text}>{TokenName[token]}</Typography>
        </Box>
        <NumberFormat
          value={input}
          onValueChange={(values) => {
            onInput(trimStart(values.value, "."), maxRef.current);
            maxRef.current = false;
          }}
          allowNegative={false}
          thousandSeparator
          isNumericString
          placeholder="0.0"
          customInput={InputBase}
          sx={{
            flex: 1,
            px: 1,
            py: 0.5,
            borderLeft: 0,
            borderColor: "divider",
            fontSize: 24,
            fontWeight: 700,
            color: "rgba(180, 224, 255, 1)",
          }}
        />
        <Button
          size="small"
          sx={{
            minWidth: 48,
            fontWeight: 700,
            color: COLOR.text,
            height: "51px",
          }}
          onClick={setMax}
        >
          Max
        </Button>
      </Box>
      <Box display="flex" justifyContent="space-between" mb={2.5}>
        <Typography variant="overline" fontSize={10} color="rgb(255, 165, 57)" letterSpacing={"0.5px"} fontWeight={700}>
          {lockDownTime && btnLabel === "Stake" && `Lock: ${lockDownTime}`}
        </Typography>
        <Typography
          variant="overline"
          color={amount.gt(max) ? "error" : COLOR.text}
          fontSize={10}
          fontWeight={700}
          letterSpacing="0.5px"
        >
          {formatNumber(max)} Available
        </Typography>
      </Box>
      <PrimaryButton
        size="large"
        fullWidth
        disabled={disabled || amount.lte(0) || amount.gt(max)}
        onClick={onSubmit}
        loading={loading}
      >
        {btnLabel}
      </PrimaryButton>
    </Box>
  );
}
