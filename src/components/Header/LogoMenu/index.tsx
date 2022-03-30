import logo from "@assets/tokens/hzn.png";
import { Box, Link, Popover } from "@mui/material";
import { ReactComponent as IconArrowUp } from "@assets/images/icon-arrow-up.svg";
import { useEffect, useState } from "react";
import ContentWebLink from "./ContentWebLink";
import { openLinkDropDownAtom } from "@atoms/wallet";
import { useAtom } from "jotai";
import { LINK_EXCHANGE } from "@utils/constants";
import hznLogo from "@assets/tokens/hzn.png";

interface Props {
    height?: number;
}
export default function LogoMenu({ height = 90 }: Props) {
    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

    const [openLinkDropDown, setOpenLinkDropDown] = useAtom(openLinkDropDownAtom);

    const handleOpen = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl((prev) => (prev ? null : event.currentTarget));
        setOpenLinkDropDown(!openLinkDropDown)
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        if (!openLinkDropDown) {
            setAnchorEl(null);
        }
    }, [openLinkDropDown])

    return (
        <Box
            // pl={1.25}
            width={337}
            display="flex"
            alignItems="center"
            onClick={handleOpen}
            sx={{
                cursor: "pointer",
            }}
            m={{
                xs: "auto",
                md: "initial",
            }}
        >
            <ContentWebLink icon={hznLogo} index={0} title='GENESIS' desc='Mint Synthetic Assets and Earn Rewards' />
            <Popover
                open={!!anchorEl}
                anchorEl={anchorEl}
                onClose={handleClose}
                transitionDuration={{
                    enter: 50,
                    appear: 50,
                    exit: 10,
                }}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: 50,
                }}
                sx={{
                    top: height,
                    ".MuiBackdrop-invisible": {
                        top: height,
                        bgcolor: "rgba(6, 14, 31, 0.7)",
                        backdropFilter: "blur(8px)",
                    },
                    ".MuiPopover-paper": {
                        mt: '-84px',
                        maxWidth: 310,
                        bgcolor: "#0B1828",
                    },
                }}
            >
                <Link
                    href={LINK_EXCHANGE}
                    target="_blank"
                    underline="none"
                >
                    <ContentWebLink index={1} title='EXCHANGE' desc='Trade Borderless Derivatives' />
                </Link>
                <Link
                    href="https://dashboard.horizonprotocol.com"
                    target="_blank"
                    underline="none"
                >
                    <ContentWebLink index={2} title='DASHBOARD' desc='Track Real-Time Network Statistics' />
                </Link>
            </Popover>
        </Box>
    );
}
