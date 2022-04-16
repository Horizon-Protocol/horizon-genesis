// export default chart with some addtional view of the chart

import { Box, BoxProps, List, ListItem, ListItemIcon } from "@mui/material";

interface LWChartProps {
    loading?: boolean;
    bindRef(instance: HTMLDivElement): void;
}

export default function LightWeightChart({
    loading = false,
    bindRef,
} : LWChartProps & BoxProps){
    return (
        <Box height={320} width={200}>
            <Box ref={bindRef} width="100%" height="100%">
                
            </Box>
        </Box>
    )
}