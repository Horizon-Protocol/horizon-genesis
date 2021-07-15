import { Box, ButtonBase, ButtonBaseProps } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";

interface StyleProps {
  color: string;
  active: boolean;
  disabled?: boolean;
}

const useStyles = makeStyles(({ breakpoints, palette }) =>
  createStyles({
    button: {
      width: 150,
      borderRadius: 4,
      flexDirection: "column",
      alignItems: "stretch",
      background: "#0A1624",
      overflow: "hidden",
      opacity: ({ disabled }) => (disabled ? 0.2 : 1),
      cursor: ({ disabled }) => (disabled ? "not-allowed" : "pointer"),
      [breakpoints.down("xs")]: {
        width: "30%",
      },
    },
    title: {
      lineHeight: "24px",
      background: ({ active, color }: StyleProps) =>
        active ? color : fade(palette.divider, 0.5),
      color: ({ active, disabled }: StyleProps) =>
        !disabled && active ? "#0A1624" : "#62B5DB",
      textTransform: "uppercase",
      fontWeight: 700,
      letterSpacing: "0.43px",
      [breakpoints.down("xs")]: {
        fontSize: 10,
        fontWeight: 400,
      },
    },
    content: {
      [breakpoints.down("xs")]: {
        flexDirection: "column",
      },
    },
    percent: {
      color: ({ disabled, active, color }: StyleProps) =>
        !disabled && active ? color : "#6E89A6",
      // fontFamily: "Rawline",
      fontSize: 22,
      letterSpacing: "0.92px",
      lineHeight: "30px",
    },
    suffix: {
      marginLeft: 8,
      color: ({ disabled, active, color }: StyleProps) =>
        !disabled && active ? color : "#6E89A6",
      fontSize: 12,
      letterSpacing: "0.5px",
      lineHeight: "14px",
      whiteSpace: "nowrap",
    },
  })
);

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
  const classes = useStyles({ color, active, disabled });

  return (
    <ButtonBase
      disableRipple
      disabled={disabled}
      className={classes.button}
      {...props}
    >
      <span className={classes.title}>{title}</span>
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
        className={classes.content}
      >
        <span className={classes.percent}>{percent.toFixed(0)}%</span>
        <span className={classes.suffix}>
          Target <br /> C-Ratio
        </span>
      </Box>
    </ButtonBase>
  );
}
