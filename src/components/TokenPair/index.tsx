import { useCallback, useState } from "react";
import { useSetState } from "ahooks";
import { Box, BoxProps } from "@material-ui/core";
import TokenInput from "./TokenInput";
import InputGap from "./InputGap";
import { BigNumber } from "@ethersproject/bignumber";

export type TokenProps = Omit<TokenInputProps, "input" | "onInput">;

export interface TokenPairProps {
  fromToken: TokenProps;
  toToken: TokenProps;
  arrowImg?: string;
  onChange?(): void;
}
export default function TokenPair({
  fromToken,
  toToken,
  arrowImg,
  ...props
}: TokenPairProps & BoxProps) {
  const [state, setState] = useSetState({
    fromInput: "",
    toInput: "",
  });

  const setFromInput = useCallback<TokenInputProps["onInput"]>(
    (input) => {
      console.log("input", input);
      setState({ fromInput: input });
    },
    [setState]
  );

  const setToInput = useCallback<TokenInputProps["onInput"]>(
    (input) => {
      console.log("input", input);
      setState({ toInput: input });
    },
    [setState]
  );

  return (
    <Box {...props}>
      <TokenInput
        {...fromToken}
        input={state.fromInput}
        onInput={setFromInput}
      />
      <InputGap img={arrowImg} />
      <TokenInput {...toToken} input={state.toInput} onInput={setToInput} />
    </Box>
  );
}
