import PageCard from "@components/PageCard";
import { Box, Grid, Typography } from "@mui/material";
import { COLOR } from "@utils/theme/constants";
import { alpha } from "@mui/material/styles";
import EscrowRecord from "./EscrowRecord";
import TokenLogo from "@components/TokenLogo";
import PrimaryButton from "@components/PrimaryButton";
import useEscrowCalculations from "@hooks/Escrowed/useEscrowCalculations";
import { useMemo } from "react";
import { format } from "path";
import { formatNumber } from "@utils/number";

export default function Escrow() {

    const { totalClaimableBalance, totalEscrowBalance, totalVestedBalance } = useEscrowCalculations()

    // alert(totalEscrowBalance)

    // const escrowBalance = useMemo(() => {
    //     // alert(totalEscrowBalance)
    // }, [totalEscrowBalance])

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
                            <EscrowedCard unlockCard title="AVAILABLE HZN" color={COLOR.safe} amount={formatNumber(totalClaimableBalance)} />
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Grid container spacing={'10px'}>
                            <Grid item xs={12}>
                                <Box sx={{
                                    height: '86px',
                                }}>
                                    <EscrowedCard title="Total ESCROWED" color={COLOR.safe} amount={formatNumber(totalEscrowBalance)} />
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{
                                    height: '86px',
                                }}>
                                    <EscrowedCard title="TOTAL UNLOCKED" color={COLOR.text} amount={formatNumber(totalVestedBalance)} />
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

// ["Total ESCROWED","TOTAL UNLOCKED"][index]}
// COLOR.safe : COLOR.text,


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
            backgroundColor: alpha(COLOR.bgColor, 1),
        }}>
            {unlockCard && <TokenLogo />}
            <Typography sx={{
                alignSelf: 'center',
                verticalAlign: "center",
                width: '100%',
                textAlign: "center",
                color: COLOR.text,
                fontSize: "12px",
                letterSpacing: "1px",
                lineHeight: "25px"
            }}>
                {title}<br />
                <span style={{
                    fontSize: "24px",
                    color: color,
                    fontWeight: "bold"
                }}>{amount}</span>
                <span style={{
                    marginLeft: '4px',
                    fontSize: "16px",
                    opacity: .5
                }}>HZN</span>
            </Typography>
            {unlockCard && <PrimaryButton
                sx={{
                    mt: '8px',
                    width: '172px',
                    height: '36px'
                }}
            // loading={loading}
            // disabled={!canClaim}
            // size='small'

            // fullWidth

            // onClick={handleClaim}
            >
                UNLOCK
            </PrimaryButton>}
        </Box>
    )
}