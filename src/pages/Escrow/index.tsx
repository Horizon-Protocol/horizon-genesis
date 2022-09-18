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
import useIsMobile from "@hooks/useIsMobile";
import useEscrowDataQuery from "@hooks/Escrowed/useEscrowDataQuery";
import useFetchRewards from "@hooks/useFetchRewards";
import useEstimatedStakingRewards from "@hooks/useEstimatedStakingRewards";

export default function Escrow() {
    
    const { totalClaimableBalance, totalEscrowBalance, totalVestedBalance } = useEscrowCalculations()

    return (
        <PageCard
            mx='auto'
            title='Escrow'
            color={COLOR.text}
            description={
                <>
                    Track your escrowed HZN. Escrowed HZN can be used
                    to manage your C-Ratio and mint zUSD. Escrowed
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
                                        title={<ToolTipContent title='Available HZN' conetnt='Current amount of HZN that can be unlocked from escrow.
                                        ' />}
                                        placement='top'
                                    >
                                        <Box component='span' style={{
                                            color: COLOR.text,
                                            fontSize: "12px",
                                            fontWeight: "normal",
                                            cursor: "help"
                                        }}>
                                            Available HZN
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
                                                title={<ToolTipContent title='Total Escrowed' conetnt='Total amount of HZN currently in escrow. To see when they will unlock, check the table below.' />}
                                                placement='top'
                                            >
                                                <Box component='span' style={{
                                                    color: COLOR.text,
                                                    fontSize: "12px",
                                                    fontWeight: "normal",
                                                    cursor: "help"
                                                }}>
                                                    Total Escrowed
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
                                                title={<ToolTipContent title='Total Unlocked' conetnt='Total amount of HZN that has already been unlocked previously from escrow.' />}
                                                placement='top'
                                            >
                                                <Box component='span' style={{
                                                    color: COLOR.text,
                                                    fontSize: "12px",
                                                    fontWeight: "normal",
                                                    cursor: "help"
                                                }}>
                                                    Total Unlocked
                                                </Box>
                                            </Tooltip>
                                        }
                                        color={totalClaimableBalance.gt(zeroBN) ? COLOR.safe : COLOR.text}
                                        amount={formatNumber(totalVestedBalance)} />
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
    const isMobile = useIsMobile();
    const handleUnlock = useCallback(async () => {
        if (!vestingEntriesId){
            return
        }
        try {
          const {
            contracts: { RewardEscrowV2 },
          } = horizon.js2!;
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
                
            }}
            >
                {title}
                <div style={{
                    fontSize: unlockCard ? "24px" : isMobile ? "18px" : "24px",
                    color: color,
                    fontWeight: "bold",
                    lineHeight: '30px'
                }}>
                    {amount}
                    <span style={{
                    marginLeft: '4px',
                    fontSize: "14px",
                    opacity: .5,
                    lineHeight: '30px'
                    }}>HZN</span>
                </div>
                
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