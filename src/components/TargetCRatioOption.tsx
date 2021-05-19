import { Box, ButtonBase, ButtonBaseProps } from "@material-ui/core/";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";

const useStyles = makeStyles(({ palette }) =>
  createStyles({
    button: {
      width: 150,
      borderRadius: 4,
      flexDirection: "column",
      border: `1px solid transparent`,
      background: "#0A1624",
      overflow: "hidden",
    },
    focusVisible: {},
    title: {
      width: "100%",
      lineHeight: "24px",
      background: fade(palette.divider, 0.5),
      textTransform: "uppercase",
    },
    percent: {},
    suffix: {},
  })
);

interface Props extends ButtonBaseProps {
  color: string;
  title: string;
  percent: number;
}

export default function TargetCRatioOption({ color, title, percent }: Props) {
  const classes = useStyles({ color });

  return (
    <ButtonBase
      focusRipple
      disableRipple
      className={classes.button}
      focusVisibleClassName={classes.focusVisible}
    >
      <div className={classes.title}>{title}</div>
      <Box display='flex'>
        <span className={classes.percent}>{percent}</span>
        <span className={classes.suffix}>
          Target <br /> C-Ratio
        </span>
      </Box>
    </ButtonBase>
  );
}
