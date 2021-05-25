import { Box, BoxProps, Typography } from "@material-ui/core";
import { HelpOutline } from "@material-ui/icons";
import { useAtomValue } from "jotai/utils";
import { presetCRatioPercentsAtom } from "@atoms/app";
import { cRatioToPercent } from "@utils/number";
import PresetCRatioOption from "./CRatioOption";
import { useMemo } from "react";

interface Props extends Omit<BoxProps, "onChange"> {
  color: string;
  value: BN;
  onChange(cRatio: BN): void;
}

export default function PresetCRatioOptions({
  color,
  value,
  onChange,
  ...props
}: Props) {
  const presetCRatioPercents = useAtomValue(presetCRatioPercentsAtom);

  const currentPercent = useMemo<number>(() => cRatioToPercent(value), [value]);

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
            active={currentPercent > 0 && option.percent === currentPercent}
            onClick={() => onChange(option.cRatio)}
            {...option}
          />
        ))}
      </Box>
    </Box>
  );
}
