import { Box } from "@mui/material";

interface ToolTipContentProps {
    title?: string | JSX.Element;
    conetnt: string | JSX.Element;
}

export default function ToolTipContent({ title, conetnt }: ToolTipContentProps) {
    return (
        <Box sx={{display:'flex', flexDirection:'column'}}>
            <Box component='span' sx={{
                fontWeight:"bold",
                pb: '5px'
            }}>{title}</Box>
            {conetnt}
        </Box>
    )
}