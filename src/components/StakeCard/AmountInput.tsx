import { useCallback, useMemo, useRef } from "react";
import { Box, Button, InputBase, Typography } from "@mui/material";
import NumberFormat from "react-number-format";
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
      onInput(formatNumber(max, { decimals: 6 }), true);
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
        display='flex'
        alignItems='center'
        borderRadius={2.5}
        border={1}
        borderColor='divider'
        overflow='hidden'
      >
        <Box
          component='span'
          padding={1.5}
          display=' inline-flex'
          alignItems='center'
        >
          {logo ? (
            <Box component='img' src={logo} alt={""} mr={1} height={22} />
          ) : null}
          <Typography>{TokenName[token]}</Typography>
        </Box>
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
          sx={{
            flex: 1,
            px: 1,
            py: 0.5,
            borderLeft: 1,
            borderColor: "divider",
            fontSize: 24,
          }}
        />
        <Button
          size='small'
          sx={{
            minWidth: 48,
            fontWeight: 700,
            color: COLOR.text,
          }}
          onClick={setMax}
        >
          Max
        </Button>
      </Box>
      <Box display='flex' justifyContent='space-between' mb={2.5}>
        <Typography variant='overline' color='textSecondary'>
          {lockDownTime && `Lock: ${lockDownTime}`}
        </Typography>
        <Typography
          variant='overline'
          color={amount.gt(max) ? "error" : COLOR.text}
          fontSize={10}
          fontWeight={700}
        >
          {formatNumber(max)} Available
        </Typography>
      </Box>
      <PrimaryButton
        size='large'
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
