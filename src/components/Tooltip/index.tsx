import { Tooltip, TooltipProps } from "@mui/material";
import { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { COLOR } from "@utils/theme/constants";

const BaseTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip sx={{
    // width:'100px',
    cursor:'help'
  }} 
  enterDelay={2000}
  enterNextDelay={2000}
  enterTouchDelay={0}
  arrow 
  classes={{ popper: className }} 
  {...props} 
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: '#0A283D',
  },
  [`& .${tooltipClasses.tooltip}`]: {
    padding: '12px',
    background:'radial-gradient(79.72% 484.78% at 16.59% 25%, #092B43 0%, #0B2435 100%)',
    maxWidth: 260,
    boxShadow: '0px 0px 24px 5px #0B1D38',
    borderRadius: '4px',
    fontSize: 12,
    lineHeight: "14px",
    letterSpacing: '.5px',
    color: COLOR.text,
  },
}));

export default BaseTooltip;
 