import { Box, Link, Popover, PopoverProps } from "@mui/material";
import MenuPageList from "@components/MobileFooter/MobileMenu/MenuPageList";
import ContentWebLink from "@components/Header/LogoMenu/ContentWebLink";
import hznLogo from "@assets/tokens/hzn.png";
import { COLOR } from "@utils/theme/constants";
import { LINK_EXCHANGE } from "@utils/constants";
import { alpha } from "@mui/material/styles";

interface Props extends PopoverProps {
    menuOnClose: () => void
}

export default function MobileMenu({ menuOnClose, ...props }: Props) {

    return (
        <Popover
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            onClose={menuOnClose}
            sx={{
                // pointerEvents: 'none',
                bottom: "50px",
                ".MuiBackdrop-invisible": {
                    bgcolor: "rgba(6, 14, 31, 0.85)",
                    bottom: 50,
                },
                ".MuiPopover-paper": {
                    maxWidth: "100%",
                    width: "100%",
                    height: "100%",
                    left: "0 !important",
                    top: "auto !important",
                    maxHeight: "100%",
                    backdropFilter: "blur(12px)",
                    borderRadius: "0",
                    bgcolor: "unset",
                    position: "relative",
                    boxShadow: "none",
                },
            }}
            {...props}
        >
            <Box sx={{
                width: '100%',
                position: 'absolute',
                bottom: 0,
            }} >
                <ContentWebLink sx={{
                    "& span:nth-child(1)": {
                        color: COLOR.safe
                    },
                    pl: '22px',
                    mb: '32px'
                }} icon={hznLogo} index={0} title='GENESIS' desc='Mint Synthetic Assets and Earn Rewards' />
                <Link
                    href={LINK_EXCHANGE}
                    target="_blank"
                    underline="none"
                >
                    <ContentWebLink sx={{
                        cursor: 'pointer',
                        opacity: .4,
                        pl: '64px',
                        mb: '32px'
                    }} bgcolor='transparent' index={1} title='EXCHANGE' desc='Trade Borderless Derivatives' />
                </Link>
                <Link
                    href="https://dashboard.horizonprotocol.com"
                    target="_blank"
                    underline="none"
                >
                    <ContentWebLink sx={{
                        cursor: 'pointer',
                        opacity: .4,
                        pl: '64px',
                        mb: '32px'
                    }} bgcolor='transparent' index={2} title='DASHBOARD' desc='Track Real-Time Network Statistics' />
                </Link>
                <MenuPageList onMenuClick={menuOnClose} />
            </Box>
        </Popover>
    )
}