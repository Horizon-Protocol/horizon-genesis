import { Box, BoxProps } from "@mui/material";
import { COLOR_BG_50} from "@utils/theme/constants";

//SVG box
export default function MenuSVG({children, ...props}: BoxProps){
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            borderRadius="2px"
            bgcolor={COLOR_BG_50}
            mr='3px'
            sx={{
                cursor: "pointer"
            }}
            {...props}
        >
            {children}
        </Box>
    )
}