import { HistoryType } from "@atoms/record";
import { Avatar, SvgIcon } from "@mui/material";
import { Box } from "@mui/material";
import { COLOR } from "@utils/theme/constants";
import { ReactComponent as IconMint } from "../../assets/images/icon-mint.svg"
import { ReactComponent as IconBurn } from "../../assets/images/icon-burn.svg"
import { ReactComponent as IconClaim } from "../../assets/images/icon-claim.svg"

interface TypeProps {
    historyType: HistoryType;
}

const colorMap: { [key: string]: string } = {
    'Mint': COLOR.safe,
    'Burn': COLOR.warning,
    'Claim': COLOR.text,
}

const imgMap: { [key: string]: any } = {
    'Mint': <IconMint />,
    'Burn': <IconBurn />,
    'Claim': <IconClaim />,
}

export default function TypeCell({ historyType }: TypeProps) {
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            color: colorMap[historyType],
            fontSize: '12px',
            letterSpacing: '0.5px',
        }}>
            {historyType != HistoryType.All && <SvgIcon sx={{
                mr: '6px',
                width: '16px'
            }}>
                {imgMap[historyType]}
            </SvgIcon>}
            {historyType}
        </Box>
    )
}