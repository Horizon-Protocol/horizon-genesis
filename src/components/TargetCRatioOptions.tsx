import { Box, BoxProps, Typography } from "@material-ui/core";
import { HelpOutline } from "@material-ui/icons";
import TargetCRatioOption from "./TargetCRatioOption";

interface Props extends Omit<BoxProps, "onChange"> {
  value?: number;
  options: TargetCRatioOption[];
  onChange(percent: number): void;
}

export default function TargetCRatioOptions({
  value,
  options,
  onChange,
  ...props
}: Props) {
  return (
    <Box width='100%' {...props}>
      <Typography variant='subtitle2' align='center'>
        Preset Minting Strategies
        <HelpOutline fontSize='inherit' />
      </Typography>
      <Box mt={1} display='flex' justifyContent='space-between'>
        {options.map((option) => (
          <TargetCRatioOption
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
