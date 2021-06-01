import { useCallback, useMemo } from "react";
import { Box, BoxProps } from "@material-ui/core";
import numbro from "numbro";
import { toBigNumber } from "@utils/number";
import TokenInput from "./TokenInput";
import InputGap from "./InputGap";
import { toNumber } from "lodash";

export type TokenProps = Omit<TokenInputProps, "input" | "onInput">;

export interface InputState {
  fromInput: string;
  fromMax: boolean;
  toInput: string;
  toMax: boolean;
  error: string;
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
  if (toBigNumber(inputValue).lt(0)) {
    console.log("no enough", inputValue);
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

const isExceedMax = (stringAmount: string, max?: BN) => {
  if (stringAmount && max) {
    return toBigNumber(stringAmount).gt(max);
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
      setState({
        fromInput: stringAmount && formatInputValue(stringAmount),
        fromMax: isMax,
        toInput: stringAmount && formatInputValue(toPairInput(stringAmount)),
        toMax: false,
        error: isExceedMax(stringAmount, max) ? "Insufficient balance" : "",
      });
    },
    [fromToken, setState]
  );

  const { fromAmount, toAmount } = useMemo(
    () => ({
      fromAmount: toBigNumber(state.fromInput.replace(/[^0-9.]/g, "") || 0),
      toAmount: toBigNumber(state.toInput.replace(/[^0-9.]/g, "") || 0),
    }),
    [state.fromInput, state.toInput]
  );

  const setToInput = useCallback<TokenInputProps["onInput"]>(
    (input, isMax = false) => {
      const { toPairInput, max } = toToken;
      const stringAmount = (isMax ? max?.toString() : input) || "";

      setState(() => ({
        toInput: stringAmount && formatInputValue(stringAmount),
        toMax: isMax,
        fromInput: stringAmount && formatInputValue(toPairInput(stringAmount)),
        fromMax: false,
        error: isExceedMax(stringAmount, max) ? "Insufficient balance" : "",
      }));
    },
    [setState, toToken]
  );

  return (
    <Box {...props}>
      <TokenInput
        {...fromToken}
        amount={fromAmount}
        invalid={!!state.error}
        input={state.fromInput}
        onInput={setFromInput}
      />
      <InputGap img={arrowImg} />
      <TokenInput
        {...toToken}
        amount={toAmount}
        invalid={!!state.error}
        input={state.toInput}
        onInput={setToInput}
      />
    </Box>
  );
}
