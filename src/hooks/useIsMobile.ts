import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function useIsMobile(){
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    return isMobile
}