import { Avatar, Stack, Typography } from "@mui/material"
import Logo from '../assets/logo.svg';
import TelegramIcon from '../assets/icon_telegram.svg';
import DiscordIcon from '../assets/icon_discord.svg'
import { useAtomValue } from "jotai";
import { suspensionStatusAtom } from "@atoms/app";
import useIsMobile from "@hooks/useIsMobile";
import { COLOR } from "@utils/theme/constants";

type SystemStatusProps = {
    children: React.ReactNode;
};

const SystemStatus = ({
    children
} : SystemStatusProps) => {
    const { status } = useAtomValue(suspensionStatusAtom)
    const isMobile = useIsMobile()

    const handleClick = (url: string) => {
        window.open(url, '_blank', 'noopener')
    }

    return status ? (
        <Stack direction={'column'} justifyContent={'center'} alignItems={'center'} sx={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            height: '100vh',
            width: '100vw',
            zIndex: 100,
            background: '#070D14'
        }}>
            <Avatar src={Logo} sx={{
                position: 'absolute',
                top: '25px',
                left: '20px',
                height: '30px',
                width: '200px',
                overflow: 'visible',
            }} />
            <Typography sx={{
                fontSize: isMobile ? 54 : 92,
                lineHeight: 1.12,
                fontWeight: 700,
                textAlign: 'center',
                px: '40px',
                color: '#070D14',
                '-webkit-text-stroke': `1px ${COLOR.safe}`,
            }}>Upgrade {!isMobile ? <br/> : ''}In Progress...</Typography>
            <Typography sx={{
                mt: '20px',
                textAlign: 'center',
                px: '20px'
            }}>Scheduled maintenance in progress. System will resume shortly.</Typography>
            <Stack direction={'column'} alignItems={'center'} sx={{
                position: 'absolute',
                bottom: '40px',
                left: 0,
                right: 0,
            }}>
                <Typography>Get updates:</Typography>
                <Stack direction={'row'} alignItems={'center'} mt={'10px'}>
                    <Avatar
                        src={TelegramIcon}
                        sx={{
                            height: '22px',
                            width: '24px',
                            overflow: 'visible',
                            mx: '8px',
                            cursor: 'pointer',
                            opacity: 0.5,
                            '&:hover': {
                                opacity: 1,
                            }
                        }}
                        onClick={() => handleClick('https://t.me/HorizonProtocol')}
                    />
                    <Avatar
                        src={DiscordIcon}
                        sx={{
                            height: '20px',
                            width: '24px',
                            overflow: 'visible',
                            mx: '8px',
                            cursor: 'pointer',
                            opacity: 0.5,
                            '&:hover': {
                                opacity: 1,
                            }
                        }}
                        onClick={() => handleClick('https://discord.gg/HorizonProtocol')}
                    />
                </Stack>
            </Stack>
        </Stack>
    ) : (
        <>{children}</>
    )
}

export default SystemStatus
