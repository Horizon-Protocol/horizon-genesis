import { Tooltip, TooltipProps } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { COLOR } from "@utils/theme/constants";

const StyledTooltip = withStyles(({ typography, palette, spacing }) => ({
  tooltip: {
    padding: spacing(1),
    backgroundColor: "#102637",
    maxWidth: 300,
    border: `1px solid ${COLOR.tip}`,
    fontSize: typography.pxToRem(12),
    lineHeight: "18px",
    color: palette.text.secondary,
  },
}))(Tooltip);

export default function BaseTooltip({ children, ...props }: TooltipProps) {
  return (
    <StyledTooltip placement='top' interactive {...props}>
      {children}
    </StyledTooltip>
  );
}
