import { useMemo, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Box, Typography, BoxProps, useMediaQuery } from "@mui/material";
import { alpha, useTheme, styled } from "@mui/material/styles";
import { COLOR } from "@utils/theme/constants";
import { RecordButtonProps } from "..";
import SvgIcon from "@mui/material/SvgIcon";

const Img = styled("img")``;

export default function RecordButton(data: RecordButtonProps) {

    const history = useHistory();

    const { breakpoints } = useTheme();
    const downLG = useMediaQuery(breakpoints.down("lg"));
    const [hightLight, setHightLight] = useState(false)

    const { to, img, selectedImg, selected, title } = data
    return (
        <Box
            onMouseEnter={() => {
                setHightLight(true)
            }}
            onMouseLeave={() => {
                setHightLight(false)
            }}
            onClick={() => {
                history.push(to);
            }}
            sx={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                mt: downLG ? "10px" : "0px",
                mb: downLG ? "0px" : "20px",
            }}
        >
            <SvgIcon
                sx={{
                    width: "40px",
                    height: "40px",
                }}
            >
                {hightLight ? selectedImg : selected ? selectedImg : img}
            </SvgIcon>

            <Typography
                sx={{
                    color: hightLight ? COLOR.safe : selected ? COLOR.safe : alpha(COLOR.text, 0.75),
                    fontWeight: selected ? "bold" : "normal",
                    lineHeight: "16px",
                    fontSize: "14px",
                    mt: "5px",
                    textAlign: "center",
                }}
            >
                {title}
            </Typography>
        </Box>
    )
}