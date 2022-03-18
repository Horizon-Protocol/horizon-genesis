import { HistoryType } from "@atoms/record";
import { Avatar } from "@mui/material";
import { Box } from "@mui/material";
import { COLOR } from "@utils/theme/constants";
import iconMint from "../../assets/images/icon-mint.png"
import iconBurn from "../../assets/images/icon-burn.png"
import iconClaim from "../../assets/images/icon-claim.png"

interface TypeProps{
    historyType: HistoryType;
}

const colorMap: {[key: string]: string} = {
    'Mint': COLOR.safe,
    'Burn': COLOR.warning,
    'Claim': COLOR.text,
}

const imgMap: {[key: string]: any} = {
    'Mint': iconMint,
    'Burn': iconBurn,
    'Claim': iconClaim,
}

export default function TypeCell({historyType}: TypeProps){
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            color: colorMap[historyType],
            fontSize: '12px',
            letterSpacing: '0.5px',
        }}>
            <img hidden={historyType == HistoryType.All} style={{marginRight:'6px'}} src={imgMap[historyType]} />
            {historyType}
        </Box>
    )
}