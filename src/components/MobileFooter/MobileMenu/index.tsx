import { Box, BoxProps, Link, Popover, PopoverProps } from "@mui/material";
import MenuPageList from "@components/MobileFooter/MobileMenu/MenuPageList";
import ContentWebLink from "@components/Header/LogoMenu/ContentWebLink";
import hznLogo from "@assets/tokens/hzn.png";
import { COLOR } from "@utils/theme/constants";
import { LINK_EXCHANGE } from "@utils/constants";
import { alpha } from "@mui/material/styles";

interface Props {
    menuOnClose: () => void
}

export default function MobileMenu({ menuOnClose, ...props }: Props & BoxProps) {
    return (
        <Box sx={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            bottom: 0,
            display: 'flex',
            flexDirection: 'column-reverse',
            overflowY: 'scroll',
        }}
            {...props}
        >
            <MenuPageList onMenuClick={menuOnClose} />
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
            <ContentWebLink sx={{
                "& span:nth-child(1)": {
                    color: COLOR.safe
                },
                pl: '22px',
                mt: '32px',
                mb: '32px'
            }} icon={hznLogo} index={0} title='GENESIS' desc='Mint Synthetic Assets and Earn Rewards' />
        </Box>
    )
}