import { Box, ClickAwayListener, Tooltip, TooltipProps } from "@mui/material";
import { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { COLOR } from "@utils/theme/constants";
import { makeStyles } from "@mui/styles";
import theme from "@utils/theme";
import { useCallback, useState } from "react";
import useIsMobile from "@hooks/useIsMobile";
interface BaseTooltipProps {
  tooltipWidth?: number
}

const StyledTooltip = styled(({ tooltipWidth, className, ...props }: BaseTooltipProps & TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ tooltipWidth = 217, theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: '#0A283D'
  },
  [`& .${tooltipClasses.tooltip}`]: {
    padding: '12px',
    background: 'radial-gradient(79.72% 484.78% at 16.59% 25%, #092B43 0%, #0B2435 100%)',
    width: tooltipWidth,
    boxShadow: '0px 0px 24px 5px #0B1D38',
    borderRadius: '4px',
    fontSize: 12,
    lineHeight: "14px",
    letterSpacing: '.5px',
    color: COLOR.text,
  },
}));

const BaseTooltip = ({ tooltipWidth, children, ...props }: BaseTooltipProps & TooltipProps) => {

  const isMobile = useIsMobile()

  const [open, setOpen] = useState(false)
  return (
    isMobile ?
      <ClickAwayListener onClickAway={() => {
        setOpen(false)
      }}>
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
          <Box onClick={() => {
            setOpen(true)
          }}>
            {children}
          </Box>
        </StyledTooltip>
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
