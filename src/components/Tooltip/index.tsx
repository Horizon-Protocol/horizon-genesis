import { Tooltip, TooltipProps } from "@mui/material";
import { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { COLOR } from "@utils/theme/constants";
import { makeStyles } from "@mui/styles";
import theme from "@utils/theme";
import { useCallback } from "react";

interface BaseTooltipProps{
  tootipWidth?: number
}

const BaseTooltip = ({ tootipWidth = 217, children, ...props }: BaseTooltipProps & TooltipProps) => {
  const useToolTipStyles = makeStyles<BaseTooltipProps>(theme => ({
    arrow: {
      color: '#0A283D'
    },
    tooltip: (props: BaseTooltipProps) => ({
      padding: '12px',
      background: 'radial-gradient(79.72% 484.78% at 16.59% 25%, #092B43 0%, #0B2435 100%)',
      width: props.tootipWidth,
      boxShadow: '0px 0px 24px 5px #0B1D38',
      borderRadius: '4px',
      fontSize: 12,
      lineHeight: "14px",
      letterSpacing: '.5px',
      color: COLOR.text,
    })
  }))

  let classes = useToolTipStyles({tootipWidth: tootipWidth});

  // const tmp = useCallback(()=>(
  //     <Tooltip sx={{
  //       cursor: 'help',
  //       innerWidth: 12,
  //     }}
  //       classes={{
  //         arrow: classes.arrow,
  //         tooltip: classes.tooltip
  //       }}
  //       enterDelay={500}
  //       enterNextDelay={500}
  //       enterTouchDelay={0}
  //       arrow
  //       {...props}
  //     >
  //       {children}
  //     </Tooltip>
  //   )
  // ,[tootipWidth])

  // return tmp()

  return (
    <Tooltip sx={{
      cursor: 'help',
      innerWidth: 12,
    }}
      classes={{
        arrow: classes.arrow,
        tooltip: classes.tooltip
      }}
      enterDelay={500}
      enterNextDelay={500}
      enterTouchDelay={0}
      arrow
      {...props}
    >
      {children}
    </Tooltip>
  )
  
}

export default BaseTooltip;

