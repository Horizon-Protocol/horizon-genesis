import { Box, ButtonBase, ButtonBaseProps } from "@mui/material";
import { alpha } from "@mui/material/styles";

declare global {
  interface PresetCRatioOption {
    color: string;
    title: string;
    cRatio: BN;
    percent: number;
  }
}

interface Props
  extends PresetCRatioOption,
    Omit<ButtonBaseProps, keyof PresetCRatioOption> {
  active: boolean;
}

export default function PresetCRatioOption({
  color,
  title,
  percent,
  cRatio,
  active,
  disabled,
  ...props
}: Props) {
  return (
    <ButtonBase
      disableRipple
      disabled={disabled}
      sx={{
        fontSize: 13,
        width: {
          xs: "30%",
          sm: 150,
        },
        borderRadius: 1,
        flexDirection: "column",
        alignItems: "stretch",
        bgcolor: "#0A1624",
        overflow: "hidden",
        opacity: disabled ? 0.2 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      {...props}
    >
      <Box
        component='span'
        lineHeight='24px'
        bgcolor={({ palette }) =>
          active ? color : alpha(palette.divider, 0.5)
        }
        color={!disabled && active ? "#0A1624" : "#62B5DB"}
        fontSize={13}
        fontWeight={{
          xs: 400,
          sm: 700,
        }}
        letterSpacing='0.43px'
        sx={{
          textTransform: "uppercase",
        }}
      >
        {title}
      </Box>
      <Box
        display='flex'
        flexGrow={1}
        py={1}
        border={1}
        borderTop='none'
        borderRadius='0 0 4px 4px'
        borderColor={active ? color : "transparent"}
        justifyContent='center'
        alignItems='center'
        flexDirection={{
          xs: "column",
          sm: "row",
        }}
      >
        <Box
          component='span'
          color={!disabled && active ? color : "#6E89A6"}
          // fontFamily: "Rawline",
          fontSize={22}
          letterSpacing='0.92px'
          lineHeight='30px'
        >
          {percent.toFixed(0)}%
        </Box>
        <Box
          component='span'
          ml={1}
          color={!disabled && active ? color : "#6E89A6"}
          fontSize={12}
          letterSpacing='0.5px'
          lineHeight='14px'
          whiteSpace='nowrap'
        >
          Target <br /> C-Ratio
        </Box>
      </Box>
    </ButtonBase>
  );
}
