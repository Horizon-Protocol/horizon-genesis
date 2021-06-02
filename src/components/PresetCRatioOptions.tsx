import { useMemo } from "react";
import { Box, BoxProps, Typography } from "@material-ui/core";
import { HelpOutline } from "@material-ui/icons";
import { useAtomValue } from "jotai/utils";
import { presetCRatioPercentsAtom } from "@atoms/app";
import { cRatioToPercent } from "@utils/number";
import PresetCRatioOption from "./CRatioOption";
import { debtAtom } from "@atoms/debt";
import useWallet from "@hooks/useWallet";

interface Props extends Omit<BoxProps, "onChange"> {
  color: string;
  isBurn?: boolean;
  value: BN; // cRatio that changed to
  onChange(cRatio: BN): void;
}

export default function PresetCRatioOptions({
  color,
  isBurn = false,
  value,
  onChange,
  ...props
}: Props) {
  const { account } = useWallet();
  const { currentCRatio } = useAtomValue(debtAtom);
  const presetCRatioPercents = useAtomValue(presetCRatioPercentsAtom);

  const changedCratioPercent = useMemo<number>(
    () => cRatioToPercent(value),
    [value]
  );

  if (!account) {
    return null;
  }

  return (
    <Box width='100%' {...props}>
      <Typography variant='subtitle2' align='center'>
        Preset Strategies
        <HelpOutline fontSize='inherit' />
      </Typography>
      <Box mt={1} display='flex' justifyContent='space-between'>
        {presetCRatioPercents.map((option) => (
          <PresetCRatioOption
            key={option.title}
            color={color}
            disabled={isBurn && currentCRatio.lte(option.cRatio)}
            active={
              changedCratioPercent > 0 &&
              option.cRatio.toFixed(6) === value.toFixed(6)
            }
            onClick={() => onChange(option.cRatio)}
            {...option}
          />
        ))}
      </Box>
    </Box>
  );
}
