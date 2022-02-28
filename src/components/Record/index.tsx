import { Box, Button, Typography, alpha } from "@mui/material";
import { styled } from "@mui/material/styles";
import { COLOR } from "@utils/theme/constants";
import { atom } from "jotai";

import bnbLogo from "@assets/tokens/bnb.png";
import cakeLogo from "@assets/tokens/cake.png";
import { useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";

const Img = styled("img")``;

export default function Record() {
    // const styledTabs = useMemo<StyledTabProps[]>(
    //     () =>
    //       tabs.map(({ color, ...item }) => ({
    //         ...item,
    //         color,
    //         StyledTab: getStyledTab(color) as StyledTabType,
    //         hasAlert: item.label === "Claim" && hasRewards,
    //       })),
    //     [hasRewards]
    //   );

    const { pathname } = useLocation()
    const history = useHistory()

    interface RecordButtonProps {
        img: string;
        selectedImg: string;
        selected: boolean;
        title: string | JSX.Element;
        to: string
    }

    const recordButtons = useMemo<RecordButtonProps[]>(
        () => [
            {
                img: bnbLogo,
                selectedImg: cakeLogo,
                selected: "/debtTracker" === pathname,
                title: <>Debt<br />Tracker</>,
                to: "debtTracker"
            },
            {
                img: bnbLogo,
                selectedImg: cakeLogo,
                selected: "/escrow" === pathname,
                title: "Escrow",
                to: "escrow"
            },
            {
                img: bnbLogo,
                selectedImg: cakeLogo,
                selected: "/history" === pathname,
                title: "History",
                to: "history"
            },
        ],
        [pathname]
    )

    return (
        <Box sx={{
            position: "absolute",
            right: 0,
            top: 0,

        }}>
            {recordButtons.map(({ to, img, selectedImg, selected, title }: RecordButtonProps) => (
                <Box key={to} onClick={() => {
                    // console.log({
                    //     selected:selected,
                    //     title:pathname
                    // })
                    history.push(to)
                }} sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    mb: "20px"
                }}>
                    <Img src={selected ? selectedImg : img} sx={{
                        width: "40px",
                        height: "40px"
                    }} />
                    <Typography sx={{
                        color: selected ? COLOR.safe : alpha(COLOR.text, 0.75),
                        fontWeight: selected ? "bold" : "normal",
                        lineHeight: '16px',
                        fontSize: '14px',
                        mt: '5px',
                        textAlign: 'center',
                    }}>{title}</Typography>
                </Box>
            ))}
        </Box>
    )
}
