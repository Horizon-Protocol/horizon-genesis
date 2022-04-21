import PageCard from "@components/PageCard";
import { Box, Grid, SvgIcon, Typography } from "@mui/material";
import { COLOR } from "@utils/theme/constants";
import { alpha } from "@mui/material/styles";
import EscrowRecord from "./EscrowRecord";
import PrimaryButton from "@components/PrimaryButton";
import useEscrowCalculations from "@hooks/Escrowed/useEscrowCalculations";
import { formatNumber, BNWithDecimals, zeroBN } from "@utils/number";
import { ReactComponent as IconHZN } from "@assets/images/hzn.svg";
import { lineHeight } from "@mui/system";

export default function Escrow() {

    const { totalClaimableBalance, totalEscrowBalance, totalVestedBalance } = useEscrowCalculations()

    return (
        <PageCard
            mx='auto'
            // color={THEME_COLOR}
            // headerBg={headerBg}
            title='Escrow'
            description={
                <>
                    Track your escrowed HZN. Escrowed HZN can be used<br />
                    to manage your C-Ratio and mint zUSD. Escrowed<br />
                    HZN is vested for 1 year from the claim date.
                </>
            }
        >
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between'
                // width:'100%'
            }}>
                <Grid container spacing={'10px'}>
                    <Grid item xs={6}>
                        <Box sx={{
                            height: '182px',
                        }}>
                            <EscrowedCard unlockCard
                                title="AVAILABLE HZN"
                                color={totalClaimableBalance.gt(zeroBN) ? COLOR.safe : COLOR.text}
                                amount={formatNumber(totalClaimableBalance)} />
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Grid container spacing={'10px'}>
                            <Grid item xs={12}>
                                <Box sx={{
                                    height: '86px',
                                }}>
                                    <EscrowedCard
                                        title="TOTAL ESCROWED"
                                        color={COLOR.safe}
                                        amount={formatNumber(totalEscrowBalance)} />
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{
                                    height: '86px',
                                }}>
                                    <EscrowedCard
                                        title="TOTAL UNLOCKED"
                                        color={totalClaimableBalance.gt(zeroBN) ? COLOR.safe : COLOR.text}
                                        amount={formatNumber(BNWithDecimals(totalVestedBalance))} />
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            <EscrowRecord />
        </PageCard>
    )
}

interface EscrowedCardProps {
    unlockCard?: boolean,
    title: string,
    color: string,
    amount: string
}

const EscrowedCard = ({ unlockCard, title, color, amount }: EscrowedCardProps) => {
    return (
        <Box sx={{
            borderRadius: '4px',
            display: 'flex',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: COLOR.bgColor,
        }}>
            {unlockCard && <SvgIcon
                sx={{
                    mb: '10px',
                    width: "32px",
                    height: "32px",
                }}
            >
                <IconHZN />
            </SvgIcon>}
            <Typography sx={{
                alignSelf: 'center',
                verticalAlign: "center",
                width: '100%',
                textAlign: "center",
                color: COLOR.text,
                fontSize: "12px",
                letterSpacing: "1px",
                lineHeight: "14px",
                textTransform: 'uppercase'
            }}>
                {title}<br />
                <span style={{
                    fontSize: "24px",
                    color: color,
                    fontWeight: "bold",
                    lineHeight: '30px'
                }}>{amount}</span>
                <span style={{
                    marginLeft: '4px',
                    fontSize: "16px",
                    opacity: .5,
                    lineHeight: '30px'
                }}>HZN</span>
            </Typography>
            {unlockCard && <PrimaryButton
                disabled={true}
                sx={{
                    mt: '8px',
                    width: '172px',
                    height: '36px'
                }}
            >
                UNLOCK
            </PrimaryButton>}
        </Box>
    )
}