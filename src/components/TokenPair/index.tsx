import { useCallback, useState } from "react";
import { Box, BoxProps } from "@material-ui/core";
import TokenInput from "./TokenInput";
import InputGap from "./InputGap";

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
  const [fromInput, setFromInput] = useState<string>("");
  const [toInput, setToInput] = useState<string>("");

  const onInput = useCallback<TokenInputProps["onInput"]>(() => {
    console.log("input");
  }, []);

  return (
    <Box {...props}>
      <TokenInput {...fromToken} input={fromInput} onInput={onInput} />
      <InputGap img={arrowImg} />
      <TokenInput {...toToken} input={toInput} onInput={onInput} />
    </Box>
  );
}
