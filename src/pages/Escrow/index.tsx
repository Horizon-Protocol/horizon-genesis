import PageCard from "@components/PageCard";
import { Box, Grid, SvgIcon, Typography } from "@mui/material";
import { COLOR } from "@utils/theme/constants";
import EscrowRecord from "./EscrowRecord";
import PrimaryButton from "@components/PrimaryButton";
import useEscrowCalculations from "@hooks/Escrowed/useEscrowCalculations";
import { formatNumber, BNWithDecimals, zeroBN } from "@utils/number";
import { ReactComponent as IconHZN } from "@assets/images/hzn.svg";
import ToolTipContent from "@components/Tooltip/ToolTipContent";
import Tooltip from "@components/Tooltip";
import useRefresh from "@hooks/useRefresh";
import { useCallback, useState } from "react";
import horizon from "@lib/horizon";
import { getWalletErrorMsg } from "@utils/helper";
import { useSnackbar } from "notistack";
import { ethers } from "ethers";

export default function Escrow() {

    const { totalClaimableBalance, totalEscrowBalance, totalVestedBalance } = useEscrowCalculations()

    return (
        <PageCard
            mx='auto'
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
                <Grid container spacing={{md:'10px',xs:'1px'}}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{
                            height: '182px',
                        }}>
                            <EscrowedCard unlockCard
                                title={
                                    <Tooltip
                                        title={<ToolTipContent title='AVAILABLE HZN' conetnt='AVAILABLE HZN' />}
                                        placement='top'
                                    >
                                        <Box component='span' style={{
                                            color: COLOR.text,
                                            fontSize: "12px",
                                            fontWeight: "normal"
                                        }}>
                                            AVAILABLE HZN
                                        </Box>
                                    </Tooltip>
                                }
                                color={totalClaimableBalance.gt(zeroBN) ? COLOR.safe : COLOR.text}
                                amount={formatNumber(totalClaimableBalance)} />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Grid container spacing={{md:'10px',xs:'1px'}}>
                            <Grid item xs={6} md={12}>
                                <Box sx={{
                                    height: '86px',
                                }}>
                                    <EscrowedCard
                                        title={
                                            <Tooltip
                                                title={<ToolTipContent title='TOTAL ESCROWED' conetnt='TOTAL ESCROWED' />}
                                                placement='top'
                                            >
                                                <Box component='span' style={{
                                                    color: COLOR.text,
                                                    fontSize: "12px",
                                                    fontWeight: "normal"
                                                }}>
                                                    TOTAL ESCROWED
                                                </Box>
                                            </Tooltip>
                                        }
                                        color={COLOR.safe}
                                        amount={formatNumber(totalEscrowBalance)} />
                                </Box>
                            </Grid>
                            <Grid item xs={6} md={12}>
                                <Box sx={{
                                    height: '86px',
                                }}>
                                    <EscrowedCard
                                        title={
                                            <Tooltip
                                                title={<ToolTipContent title='TOTAL UNLOCKED' conetnt='TOTAL UNLOCKED' />}
                                                placement='top'
                                            >
                                                <Box component='span' style={{
                                                    color: COLOR.text,
                                                    fontSize: "12px",
                                                    fontWeight: "normal"
                                                }}>
                                                    TOTAL UNLOCKED
                                                </Box>
                                            </Tooltip>
                                        }
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
    title: string | JSX.Element,
    color: string,
    amount: string
}

const EscrowedCard = ({ unlockCard, title, color, amount }: EscrowedCardProps) => {
    const { enqueueSnackbar } = useSnackbar();
    const { vestingEntriesId } = useEscrowCalculations()

    const refresh = useRefresh();
    const [loading, setLoading] = useState(false);
    const handleUnlock = useCallback(async () => {
        if (!vestingEntriesId){
            return
        }
        try {
          const {
            contracts: { RewardEscrowV2 },
          } = horizon.js!;
          console.log('RewardEscrowV2',RewardEscrowV2)
          setLoading(true);
          const tx: ethers.ContractTransaction = await RewardEscrowV2.vest(vestingEntriesId);
          await tx.wait(1);
          refresh();
        } catch (e: any) {
            enqueueSnackbar(e.message, {
                variant: "error",
            });
        }
        setLoading(false);
      }, [enqueueSnackbar, refresh, vestingEntriesId]);

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
            loading={loading}
                onClick={handleUnlock}
                disabled={Number(amount) <= 0}
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