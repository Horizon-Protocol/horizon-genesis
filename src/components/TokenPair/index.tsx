import { useCallback, useMemo } from "react";
import { Box, BoxProps } from "@material-ui/core";
import numbro from "numbro";
import { toBigNumber } from "@utils/number";
import TokenInput from "./TokenInput";
import InputGap from "./InputGap";

export type TokenProps = Omit<TokenInputProps, "input" | "onInput">;

export interface InputState {
  fromInput: string;
  fromMax: boolean;
  toInput: string;
  toMax: boolean;
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
    console.log("no enough");
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
      const toPairAmount = (isMax ? max?.toString() : input) || "0";
      setState({
        fromInput: formatInputValue(input),
        fromMax: isMax,
        toInput: formatInputValue(toPairInput(toPairAmount)),
        toMax: false,
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
      const toPairAmount = (isMax ? max?.toString() : input) || "0";
      console.log("to input change:", input, toPairAmount);
      setState({
        toInput: formatInputValue(input),
        toMax: isMax,
        fromInput: formatInputValue(toPairInput(toPairAmount)),
        fromMax: false,
      });
    },
    [setState, toToken]
  );

  return (
    <Box {...props}>
      <TokenInput
        {...fromToken}
        amount={fromAmount}
        input={state.fromInput}
        onInput={setFromInput}
      />
      <InputGap img={arrowImg} />
      <TokenInput
        {...toToken}
        amount={toAmount}
        input={state.toInput}
        onInput={setToInput}
      />
    </Box>
  );
}
