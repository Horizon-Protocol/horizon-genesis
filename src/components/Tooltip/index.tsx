import { Box, ClickAwayListener, Tooltip, TooltipProps } from "@mui/material";
import { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { COLOR } from "@utils/theme/constants";
import { makeStyles } from "@mui/styles";
import theme from "@utils/theme";
import { useCallback, useState } from "react";
import useIsMobile from "@hooks/useIsMobile";
interface BaseTooltipProps {
  clickAble?: boolean,
  tooltipWidth?: number
}

const StyledTooltip = styled(({ tooltipWidth, className, ...props }: BaseTooltipProps & TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ tooltipWidth, theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: '#0A283D'
  },
  [`& .${tooltipClasses.tooltip}`]: {
    padding: '12px',
    background: 'radial-gradient(79.72% 484.78% at 16.59% 25%, #092B43 0%, #0B2435 100%)',
    width: tooltipWidth,
    maxWidth: 217,
    boxShadow: '0px 0px 24px 5px #0B1D38',
    borderRadius: '4px',
    fontSize: 12,
    lineHeight: "16px",
    letterSpacing: '.5px',
    color: COLOR.text,
  },
}));

const BaseTooltip = ({ clickAble, tooltipWidth, children, ...props }: BaseTooltipProps & TooltipProps) => {

  const isMobile = useIsMobile()

  const [open, setOpen] = useState(false)
  return (
    (isMobile || clickAble) ?
      <ClickAwayListener onClickAway={() => {
        // alert('close')
        setOpen(false)
      }}>
        <div>
        <StyledTooltip tooltipWidth={tooltipWidth} sx={{
          cursor: 'help',
          innerWidth: 12,
        }}
          PopperProps={{
            disablePortal: true,
          }}
          onClose={() => {
            setOpen(false)
          }}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          arrow
          {...props}
        >
          <Box 
          style={{display:'flex', justifyContent:'center', alignItems:'center'}} 
          onClick={() => {
            setOpen(true)
            setTimeout(() => {
              setOpen(false)
            }, 3000);
          }}>
            {children}
          </Box>
        </StyledTooltip>
        </div>
      </ClickAwayListener>
      :
      <StyledTooltip tooltipWidth={tooltipWidth} sx={{
        cursor: 'help',
        innerWidth: 12,
      }}
        enterDelay={500}
        enterNextDelay={500}
        enterTouchDelay={0}
        arrow
        {...props}
      >
        {children}
      </StyledTooltip>
  )
}

export default BaseTooltip;
