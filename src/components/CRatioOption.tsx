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
          sm: 152,
        },
        borderRadius: 1,
        flexDirection: "column",
        alignItems: "stretch",
        bgcolor: "rgba(8, 12, 22, 0.3)",
        overflow: "hidden",
        opacity: disabled ? 0.2 : active ? 1 : 0.75,
        cursor: disabled ? "not-allowed !important" : "pointer",
        pointerEvents: "all !important",
        ":hover": {opacity: disabled ? 0.2 : 1}
      }}
      {...props}
    >
      <Box
        component='span'
        lineHeight='24px'
        bgcolor={({ palette }) =>
          active ? color : "#102637"
        }
        color={!disabled && active ? "#0A1624" : "rgba(180, 224, 255, 0.5)"}
        fontSize={12}
        fontWeight={{
          xs: 400,
          sm: 700,
        }}
        letterSpacing='1px'
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
          color={!disabled && active ? color : "rgba(180, 224, 255, 1)"}
          // fontFamily: "Rawline",
          fontSize={24}
          letterSpacing='0.5px'
          lineHeight='30px'
          fontFamily='Rawline'
          marginTop={-0.625}
        >
          {percent.toFixed(0)}%
        </Box>
        <Box
          component='span'
          ml={1}
          color={!disabled && active ? color : "rgba(180, 224, 255, 1)"}
          fontSize={12}
          letterSpacing='0.5px'
          lineHeight='14px'
          whiteSpace='nowrap'
          fontFamily='Raleway'
          textAlign='left'
        >
          Target <br /> C-Ratio
        </Box>
      </Box>
    </ButtonBase>
  );
}
