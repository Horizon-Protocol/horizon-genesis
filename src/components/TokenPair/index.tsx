import { useCallback, useMemo } from "react";
import { Box, BoxProps } from "@material-ui/core";
import { toBigNumber, formatNumber } from "@utils/number";
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
      setState({
        fromInput: input,
        fromMax: isMax,
        toInput: fromToken?.toPair?.(input || "0", rate),
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
      setState({
        toInput: input,
        toMax: isMax,
        fromInput: toToken?.toPair?.(input || "0", rate),
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
