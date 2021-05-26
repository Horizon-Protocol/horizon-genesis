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
  rate: BN;
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
const formatInputValue = (inputValue: string): string =>
  inputValue &&
  numbro(inputValue).format({
    mantissa: 6,
    trimMantissa: true,
    thousandSeparated: false,
  });

export default function TokenPair({
  fromToken,
  toToken,
  rate,
  arrowImg,
  state,
  setState,
  ...props
}: TokenPairProps & BoxProps) {
  const setFromInput = useCallback<TokenInputProps["onInput"]>(
    (input, isMax = false) => {
      const { toPair, max } = fromToken;
      const toPairAmount = (isMax ? max?.toString() : input) || "0";
      setState({
        fromInput: formatInputValue(input),
        fromMax: isMax,
        toInput: formatInputValue(toPair(toPairAmount, rate)),
        toMax: false,
      });
    },
    [fromToken, rate, setState]
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
      const { toPair, max } = toToken;
      const toPairAmount = (isMax ? max?.toString() : input) || "0";
      setState({
        toInput: formatInputValue(input),
        toMax: isMax,
        fromInput: formatInputValue(toPair(toPairAmount, rate)),
        fromMax: false,
      });
    },
    [rate, setState, toToken]
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
