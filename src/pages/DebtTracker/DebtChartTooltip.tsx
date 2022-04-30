import { Box, Typography } from "@mui/material";
import { COLOR } from "@utils/theme/constants";

export interface ToolTipCellPros {
    color: string;
    title: string;
    value: string;
}

export interface ToolTipProps {
    toolTipDisplay: string,
    left?: string,
    top?: string,
    time?: string,
    debts?: ToolTipCellPros[]
}

export default function DebtChartTooltip({
    toolTipDisplay,
    left,
    top,
    time,
    debts,
}: ToolTipProps){
    return (
        <Box sx={{
            width: '224px',
            position: 'absolute',
            display: toolTipDisplay,
            fontSize: '12px',
            color: '#131722',
            zIndex: 1000,
            top: top,
            left: left,
            backgroundColor: '#11192A',
            borderRadius: '2px'
        }}>
            aaaaaaa
            aaaaaaa
            aaaaaaa
            aaaaaaa
            aaaaaaa
            aaaaaaa
            {/* <Typography sx={{
                textAlign: 'center',
                color: 'white',
                py: 'auto',
                fontSize: '12px',
                lineHeight: '30px',
                letterSpacing: '1px'
            }}>{time}</Typography>
            <Box sx={{
                // height: '82px',
                width: '100%',
                backgroundColor: COLOR.bgColor,
                display: 'flex',
                flexDirection: 'column',
                px: '12px',
                py: '10px',
                justifyContent: 'space-between'
            }}>
                {debts?.map((value, index) => (
                    <Box key={index} sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mt: '3px',
                    }}>
                        <Box sx={{
                            height: '10px',
                            width: '10px',
                            backgroundColor: debts[index].color,
                            border: '1px solid #FFFFFF',
                            borderRadius: '50%'
                        }} />
                        <Typography sx={{
                            color: debts[index].color,
                            fontSize: '12px',
                            letterSpacing: '0.5px',
                            ml: '10px'
                        }}>
                            {debts[index].title}
                        </Typography>
                        <Typography sx={{
                            color: COLOR.text,
                            fontSize: '12px',
                            letterSpacing: '0.5px',
                            // mr: '0px',
                            ml: 'auto',
                            textAlign: 'right',
                            // backgroundColor:'red'
                        }}>
                            {value.value}
                        </Typography>
                    </Box>
                ))}
            </Box> */}
        </Box>
    )
}