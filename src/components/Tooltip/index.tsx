import { Tooltip, TooltipProps } from "@mui/material";
import { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { COLOR } from "@utils/theme/constants";

const BaseTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: COLOR.tip,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    padding: theme.spacing(1),
    backgroundColor: "#102637",
    maxWidth: 300,
    border: `1px solid ${COLOR.tip}`,
    fontSize: 12,
    lineHeight: "18px",
    color: theme.palette.text.secondary,
  },
}));

export default BaseTooltip;
