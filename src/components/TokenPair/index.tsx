import { useCallback, useMemo } from "react";
import { useSetState } from "ahooks";
import { Box, BoxProps } from "@material-ui/core";
import { toBigNumber, zeroBN } from "@utils/number";
import TokenInput from "./TokenInput";
import InputGap from "./InputGap";

export type TokenProps = Omit<TokenInputProps, "input" | "onInput">;

export interface TokenPairProps {
  fromToken: TokenProps;
  toToken: TokenProps;
  price: number;
  targetCRatio?: number;
  arrowImg?: string;
  onChange?(): void;
}
export default function TokenPair({
  fromToken,
  toToken,
  price = 1,
  targetCRatio,
  arrowImg,
  ...props
}: TokenPairProps & BoxProps) {
  const [state, setState] = useSetState({
    fromInput: "",
    fromMax: false,
    toInput: "",
    toMax: false,
  });

  const setFromInput = useCallback<TokenInputProps["onInput"]>(
    (input, isMax) => {
      setState({
        fromInput: input,
        fromMax: isMax,
        toInput: (parseFloat(input || "0") * price).toString(),
      });
    },
    [price, setState]
  );

  const { fromAmount, toAmount } = useMemo(
    () => ({
      fromAmount: state.fromMax
        ? fromToken.max || zeroBN
        : toBigNumber(state.fromInput.replace(/[^0-9.]/g, "") || 0),
      toAmount: state.toMax
        ? toToken.max || zeroBN
        : toBigNumber(state.toInput.replace(/[^0-9.]/g, "") || 0),
    }),
    [
      fromToken.max,
      state.fromInput,
      state.fromMax,
      state.toInput,
      state.toMax,
      toToken.max,
    ]
  );

  const setToInput = useCallback<TokenInputProps["onInput"]>(
    (input) => {
      setState({
        toInput: input,
        fromInput: (parseFloat(input || "0") / price).toString(),
      });
    },
    [price, setState]
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
