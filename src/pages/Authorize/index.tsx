import PageCard from "@components/PageCard";
import PrimaryButton from "@components/PrimaryButton";
import useWallet from "@hooks/useWallet";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { BORDER_COLOR, COLOR } from "@utils/theme/constants";
import { useCallback, useEffect, useMemo, useState } from "react";
import horizon from "@lib/horizon";
import { ethers } from "ethers";
import { useSnackbar } from "notistack";
import AuthorizationRecord from "./AuthorizationRecord";
import { useQueryClient } from "react-query";
import { GRAPH_AUTHORIZATION } from "@utils/queryKeys";
import useQueryAuthorization from "./useQueryAuthorization";
import { utils } from "ethers";
import ConnectButton from "@components/ConnectButton";

const useStyles = makeStyles(() => ({
    noBorder: {
        border: "none",
        backgroundColor: 'rgba(16, 38, 55, 0.3)'
    },
}));

export default function Authorize() {
    const { enqueueSnackbar } = useSnackbar();

    const classes = useStyles();
    const { connected, account } = useWallet()

    const [authOperationSelectIndex, setAuthOperationSelectIndex] = useState<number>(0)
    const [address, setAddress] = useState('')
    const [loading, setLoading] = useState(false)

    const queryClient = useQueryClient();

    const handleAuthorize = useCallback(async (name: string, selectd: boolean, address: string) => {
        try {
            const {
                contracts: { DelegateApprovals },
            } = horizon.js!;
            setLoading(true);
            if (name == 'all') {
                if (selectd) {
                    const tx: ethers.ContractTransaction = await DelegateApprovals.removeAllDelegatePowers(address)
                    await tx.wait(1);
                } else {
                    const tx: ethers.ContractTransaction = await DelegateApprovals.approveAllDelegatePowers(address)
                    await tx.wait(1);
                }
            }
            if (name == 'canMint') {
                if (selectd) {
                    const tx: ethers.ContractTransaction = await DelegateApprovals.removeIssueOnBehalf(address)
                    await tx.wait(1);
                } else {
                    const tx: ethers.ContractTransaction = await DelegateApprovals.approveIssueOnBehalf(address)
                    await tx.wait(1);
                }
            }
            if (name == 'canBurn') {
                if (selectd) {
                    const tx: ethers.ContractTransaction = await DelegateApprovals.removeBurnOnBehalf(address)
                    await tx.wait(1);
                } else {
                    const tx: ethers.ContractTransaction = await DelegateApprovals.approveBurnOnBehalf(address)
                    await tx.wait(1);
                }
            }
            if (name == 'canClaim') {
                if (selectd) {
                    const tx: ethers.ContractTransaction = await DelegateApprovals.removeClaimOnBehalf(address)
                    await tx.wait(1);
                } else {
                    const tx: ethers.ContractTransaction = await DelegateApprovals.approveClaimOnBehalf(address)
                    await tx.wait(1);
                }
            }
            if (name == 'canExchange') {
                if (selectd) {
                    const tx: ethers.ContractTransaction = await DelegateApprovals.removeExchangeOnBehalf(address)
                    await tx.wait(1);
                } else {
                    const tx: ethers.ContractTransaction = await DelegateApprovals.approveExchangeOnBehalf(address)
                    await tx.wait(1);
                }
            }
            queryClient.refetchQueries([GRAPH_AUTHORIZATION, account], {
                fetching: false,
            });
        } catch (e: any) {
            enqueueSnackbar(e.message, {
                variant: "error",
            });
        }
        setLoading(false);
    }, [address])

    const errrMsg = useMemo(() => {
        let msg = ''
        if (!utils.isAddress(address) && address != '') {
            msg = 'Invalid Address'
        }
        if (address == account) {
            msg = 'Cannot Authorize Yourself'
        }
        if (!connected) {
            msg = ''
        }
        return msg
    }, [address, account, connected])

    const buttonEnable = useMemo(() => {
        // 0xCcf5b4dfB76faaCCAe3C6F36D095B55736Aa705c  myaddress

        // 0xc1b8bf285772b9eb24a2ec9475cdb1baa5c19e44  delegate
        // 0x6b695d244fbf8ddd16f86237f4decff4c0e43b91
        // 0x2ebfbf20fc54c7f64c8924c95ee596a7081576e8
        // 0x9da8f103b9a489b447bc3e536497961e99fdcead
        // 0xad4ceba3d9c4b09788b76d3b07ea4ac044e2660d
        // 0x21f59def0180705e3a4ddedbd64a84c377068bf8

        if (address == '' || !connected || address == account || errrMsg != '') {
            return false
        } else {
            return true
        }
    }, [errrMsg, connected, address, account])

    useEffect(() => {
        if (account) {

        }
    }, [account])

    return (
        <PageCard
            mx='auto'
            title='Authorize'
            color={COLOR.text}
            description={
                <>
                    Authorize permission for another wallet to conduct operations
                    (such as minting, burning,
                    claiming, and trading) on behalf of your wallet.
                </>
            }
        >
            <Box sx={{
                display: 'flex',
                flexDirection: 'column'
                // justifyContent: 'space-between'
                // width:'100%'
            }}>
                <Typography sx={{ letterSpacing: '1px', fontWeight: 'bold', fontSize: "12px", color: COLOR.text, textAlign: "center", mt: 3 }}>AUTHORIZE ADDRESS</Typography>
                <TextField
                    onChange={(e) => {
                        setAddress(e.target.value)
                    }}
                    sx={{
                        mt: '10px',
                        "& .MuiInputBase-root": {
                            "& input": {
                                textAlign: "center"
                            }
                        },
                        input: { color: COLOR.text, fontSize: '14px', fontWeight: 'bold', letterSpacing: '1px' }
                    }}
                    InputProps={{
                        autoComplete: 'off',
                        classes: { notchedOutline: classes.noBorder },
                        sx: {
                            border: 'none',
                            w: 470,
                            h: 54,
                        }
                    }}
                    id="outlined-basic" placeholder="Enter a valid address" variant="outlined" />
                <Typography sx={{ mt: '20px', lineHeight: '22px', letterSpacing: '1px', fontWeight: 'bold', fontSize: "12px", color: COLOR.text, textAlign: "center" }}>OPERATION TO AUTHORIZE</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: '6px', width: '100%' }}>
                    {['All', 'Mint', 'Burn', 'Claim', 'Trade'].map((value, index) => {
                        const selected = connected ? authOperationSelectIndex == index : false
                        return (
                            <Box key={index} onClick={() => {
                                setAuthOperationSelectIndex(index)
                            }} sx={{
                                cursor: 'pointer', borderRadius: '2px', textAlign: 'center',
                                fontWeight: selected ? 'bold' : 400,
                                backgroundColor: selected ? COLOR.safe : COLOR.bgColor,
                                color: selected ? BORDER_COLOR : COLOR.text,
                                opacity: connected ? 1 : .5,
                                lineHeight: '28px', width: '18.5%',
                                fontSize: 14
                            }}>
                                {value}
                            </Box>
                        )
                    })}
                </Box>

                {
                connected ? 
                
                <Box>
                    <PrimaryButton
                        loading={loading}
                        onClick={() => {
                            handleAuthorize(['all', 'canMint', 'canBurn', 'canClaim', 'canExchange'][authOperationSelectIndex], false, address)
                        }}
                        // disabled={Number(amount) <= 0}
                        disabled={!buttonEnable}
                        sx={{
                            mt: '25px',
                            width: '100%',
                            height: '45px'
                        }}
                    >
                        AUTHORIZE
                    </PrimaryButton>
                    <Typography sx={{ mt: '5px', lineHeight: '17px', letterSpacing: '1px', fontSize: "12px", color: COLOR.danger, textAlign: "center" }}>
                       {errrMsg}
                    </Typography>
                    <Typography sx={{ mt: '8px', lineHeight: '22px', letterSpacing: '1px', fontWeight: 'bold', fontSize: "12px", color: COLOR.text, textAlign: "center" }}>
                        MANAGE AUTHORIZATIONS
                    </Typography>
                </Box>
                :
                 <ConnectButton sx={{
                    mt: '25px',
                    width: '100%',
                    height: '45px'
                }}/>
                }

            </Box>
            <AuthorizationRecord onCheckBoxClick={(name, selected, delegate) => {
                handleAuthorize(name, selected, delegate)
            }} />
        </PageCard>
    )
}
