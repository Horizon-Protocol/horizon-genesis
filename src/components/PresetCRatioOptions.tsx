import { Box, BoxProps, Typography } from "@material-ui/core";
import { HelpOutline } from "@material-ui/icons";
import PresetCRatioOption from "./CRatioOption";

interface Props extends Omit<BoxProps, "onChange"> {
  value?: number;
  options: PresetCRatioOption[];
  onChange(percent: number): void;
}

export default function PresetCRatioOptions({
  value,
  options,
  onChange,
  ...props
}: Props) {
  return (
    <Box width='100%' {...props}>
      <Typography variant='subtitle2' align='center'>
        Preset Strategies
        <HelpOutline fontSize='inherit' />
      </Typography>
      <Box mt={1} display='flex' justifyContent='space-between'>
        {options.map((option) => (
          <PresetCRatioOption
            key={option.title}
            {...option}
            active={option.percent === value}
            onClick={() => onChange(option.percent)}
          />
        ))}
      </Box>
    </Box>
  );
}
