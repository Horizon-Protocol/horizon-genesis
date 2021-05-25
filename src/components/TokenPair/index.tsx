import { useCallback, useEffect, useMemo } from "react";
import { Box, BoxProps } from "@material-ui/core";
import { toBigNumber, zeroBN } from "@utils/number";
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
  cRatio: BN;
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
  cRatio,
  arrowImg,
  state,
  setState,
  ...props
}: TokenPairProps & BoxProps) {
  useEffect(() => {
    console.log("change cRatio", cRatio.toNumber());
    // setState({
    //   fromInput:
    // })
  }, [cRatio]);

  const setFromInput = useCallback<TokenInputProps["onInput"]>(
    (input, isMax = false) => {
      setState({
        fromInput: input,
        fromMax: isMax,
        toInput:
          fromToken?.toPair?.(cRatio, input || "0", rate).toString() || "",
        toMax: false,
      });
    },
    [cRatio, fromToken, rate, setState]
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
        fromInput:
          toToken?.toPair?.(cRatio, input || "0", rate).toString() || "",
        fromMax: false,
      });
    },
    [cRatio, rate, setState, toToken]
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
