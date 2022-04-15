import { useCallback, useEffect, useMemo } from "react";
import { Box, BoxProps, Typography } from "@mui/material";
import { useSetState } from "ahooks";
import numbro from "numbro";
import { toBN } from "@utils/number";
import { COLOR } from "@utils/theme/constants";
import TokenInput from "./TokenInput";
import InputGap from "./InputGap";
import useWallet from "@hooks/useWallet";

export type TokenProps = Omit<TokenInputProps, "input" | "onInput">;

export interface InputState {
  fromInput: string;
  toInput: string;
  isMax: boolean;
  error: string;
}

export function useInputState() {
  const { connected } = useWallet();
  const [state, setState] = useSetState<InputState>({
    fromInput: "",
    toInput: "",
    isMax: false,
    error: "",
  });

  useEffect(() => {
    if (!connected) {
      setState(() => ({
        fromInput: "",
        toInput: "",
        isMax: false,
        error: "",
      }));
    }
  }, [connected, setState]);

  return { state, setState };
}

export interface TokenPairProps {
  fromToken: TokenProps;
  toToken: TokenProps;
  arrowImg?: string;
  state: InputState;
  setState: (
    patch:
      | Partial<InputState>
      | ((prevState: InputState) => Partial<InputState>)
  ) => void;
}

/**
 * make sure converted input value is exactly same as react-number-input value
 * to avoid infinite onValueChange trigger
 *
 * @param {string} inputValue
 * @return {*}  {string}
 */
export const formatInputValue = (inputValue: string): string => {
  if (toBN(inputValue).lt(0)) {
    console.log("not enough", inputValue);
    return "0";
  }
  return (
    inputValue &&
    numbro(inputValue).format({
      mantissa: 6,
      trimMantissa: true,
      thousandSeparated: false,
    })
  );
};

export const isExceedMax = (stringAmount: string, max?: BN) => {
  if (stringAmount && max) {
    return toBN(stringAmount).gt(max);
  }
  return false;
};

export default function TokenPair({
  fromToken,
  toToken,
  arrowImg,
  state,
  setState,
  ...props
}: TokenPairProps & BoxProps) {
  const setFromInput = useCallback<TokenInputProps["onInput"]>(
    (input, isMax = false) => {
      const { toPairInput, max } = fromToken;
      const stringAmount = (isMax ? max?.toString() : input) || "";
      // console.log("setFromInput", isMax, input, stringAmount);
      setState(() => ({
        fromInput: stringAmount && formatInputValue(stringAmount),
        toInput: stringAmount && formatInputValue(toPairInput(stringAmount)),
        isMax,
        error: isExceedMax(stringAmount, max) ? "Insufficient balance" : "",
      }));
    },
    [fromToken, setState]
  );

  const { fromAmount, toAmount } = useMemo(
    () => ({
      fromAmount: toBN(state.fromInput.replace(/[^0-9.]/g, "") || 0),
      toAmount: toBN(state.toInput.replace(/[^0-9.]/g, "") || 0),
    }),
    [state.fromInput, state.toInput]
  );

  const setToInput = useCallback<TokenInputProps["onInput"]>(
    (input, isMax = false) => {
      const { toPairInput, max } = toToken;
      const { max: maxFrom } = fromToken;
      const stringAmount = (isMax ? max?.toString() : input) || "";
      // console.log("setToInput", isMax, input, stringAmount);
      const fromStringAmount = toPairInput(stringAmount);
      setState(() => ({
        toInput: stringAmount && formatInputValue(stringAmount),
        fromInput: stringAmount && formatInputValue(fromStringAmount),
        isMax,
        error: isExceedMax(fromStringAmount, maxFrom)
          ? "Insufficient balance"
          : "",
      }));
    },
    [setState, fromToken, toToken]
  );

  const handleUserInput = useCallback(() => {
    setState({ isMax: false });
  }, [setState]);

  return (
    <Box {...props}>
      <Typography
        minHeight={24}
        color={COLOR.danger}
        fontSize={10}
        fontWeight={500}
        letterSpacing="0.36px"
        lineHeight="14px"
        textAlign="center"
      >
        {state.error}
      </Typography>
      <TokenInput
        {...fromToken}
        amount={fromAmount}
        invalid={!!state.error}
        input={state.fromInput}
        onInput={setFromInput}
        onUserInput={handleUserInput}
      />
      <InputGap img={arrowImg} />
      <TokenInput
        {...toToken}
        amount={toAmount}
        invalid={!!state.error}
        input={state.toInput}
        onInput={setToInput}
        onUserInput={handleUserInput}
      />
    </Box>
  );
}
