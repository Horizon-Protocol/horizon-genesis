import { Box, BoxProps } from "@mui/material";
import TypeCell from "./TypeCell";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import dropdown_arrow from "@assets/images/hitory-dropdown-arrow.png";
import { COLOR_BG } from "@utils/theme/constants";
import { HistoryType } from "@atoms/record";

const Img = styled("img")``;

interface TypeSelectionItemProps {
    historyType: HistoryType;
    showArrow?: boolean;
    arrowUp?: boolean;
}

export default function TypeSelectionItem({
    historyType,
    showArrow = false,
    arrowUp = false,
    ...props
}: TypeSelectionItemProps & BoxProps) {

    return (
        <Box sx={{
            display: 'flex',
            alignItems: "center",
            justifyContent: 'space-between',
            px: '20px',
            cursor: 'pointer',
            backgroundColor: '#0C1D2E',
            ":hover": {
                backgroundColor: COLOR_BG,
            },
        }}
        {...props}
        >
            <TypeCell historyType={historyType} />
            <Img
                hidden={!showArrow}
                sx={{
                    opacity: arrowUp ? 1 : 0.5,
                    transform: arrowUp ? "rotate(0deg)" : "rotate(180deg)",
                    transition: "all .2s",
                }} height='4px' width='6px' src={dropdown_arrow} />
        </Box>
    )
}