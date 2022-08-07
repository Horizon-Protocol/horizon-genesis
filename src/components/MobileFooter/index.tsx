import { Box, BoxProps, Dialog, Fade, LinearProgress, Link, Popover, PopoverProps, Slide, Typography } from "@mui/material";
import { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import { useAtom } from "jotai";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import PrimaryButton from "@components/PrimaryButton";
import { COLOR_BG_50, COLOR, COLOR_BG_30, COLOR_BG } from "@utils/theme/constants";
import SvgIcon from "@mui/material/SvgIcon";
import useWallet from "@hooks/useWallet";
import useRefresh, { useIsRefrshing } from "@hooks/useRefresh";
import { useLocation, useHistory } from "react-router-dom";
import ConnectButton from "@components/ConnectButton";
import { footerMenuOpenAtom, footerMenuWalletInfoOpenAtom, footerMenuGetHZNOpenAtom } from "@atoms/app";
import { ReactComponent as Union } from "@assets/images/Union.svg";
import { ReactComponent as More } from "@assets/images/mMore.svg";
import { ReactComponent as Reset } from "@assets/images/mReset.svg";
import { ReactComponent as WalletInfoDown } from "@assets/images/menu-walletinfo-down.svg";
import WalletInfo from "../Header/WalletInfo";
import MobileMenu from "./MobileMenu";
import { currentCRatioPercentAtom, debtAtom } from "@atoms/debt";
import { zeroBN } from "@utils/number";
import useCRactioProgress from "@hooks/useCRactioProgress";
import { formatNumber } from "@utils/formatters";
import { fontSize } from "@mui/system";
import MenuSVG from "./MobileMenu/MenuSVG";
import GetHZNDialog from "./MobileMenu/GetHZNDialog";
import MenuItem from "@components/Header/HelpMenu/MenuItem";
import Dashboard from "@components/Dashboard";
import MenuDialog from "./MobileMenu/MenuDialog";
import useFetchAppData from "@hooks/useFetchAppData";
import useFetchDebtData from "@hooks/useFetchDebtData";
import useFetchZAssetsBalance from "@hooks/useFetchZAssetsBalance";
import useFetchFeePool from "@hooks/useFetchFeePool";
interface GetHZNProps {
    svg: JSX.Element;
    title: string;
    href: string;
}

export default function MobileFooter() {

    const history = useHistory()
    const { refreshing } = useIsRefrshing();
    const { connected, account } = useWallet();
    const refresh = useRefresh()
    const { pathname } = useLocation();

    useFetchAppData();
    useFetchDebtData();
    useFetchZAssetsBalance();
    useFetchFeePool();

    //menu and wallet info popover
    //menu popover
    const [menuOpen, setMenuOpen] = useAtom(footerMenuOpenAtom)
    //walletinfo popover
    const [walletInfoOpen, setWalletInfoOpen] = useAtom(footerMenuWalletInfoOpenAtom)
    //get hzn dialog
    const updateGetHZNOpen = useUpdateAtom(footerMenuGetHZNOpenAtom)
    //progress
    const { transferable, debtBalance } = useAtomValue(debtAtom);
    const { progress, color } = useCRactioProgress()
    const currentCRatioPercent = useAtomValue(currentCRatioPercentAtom);

    //menu
    const Menu = useCallback(() => {
        return (
            <MenuSVG minWidth='64px' width='64px' onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                setMenuOpen(!menuOpen)
            }}>
                {menuOpen ? (
                    <SvgIcon sx={{
                        width: '16px'
                    }}>
                        <Union />
                    </SvgIcon>
                ) : (
                    <SvgIcon sx={{
                        width: '18px'
                    }}>
                        <More />
                    </SvgIcon>
                )}
            </MenuSVG>
        )
    }, [menuOpen])

    //walletinfo arrow
    const WalletInfoButton = useCallback(() => {
        return (
            <MenuSVG
                width='44px'
                minWidth='44px'
                mr='0px'
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    setWalletInfoOpen(!walletInfoOpen)
                }}>
                <SvgIcon sx={{
                    transition: "transform ease 0.25s",
                    transform: walletInfoOpen ? undefined : "rotate(180deg)",
                    width: '15px'
                }}>
                    <WalletInfoDown />
                </SvgIcon>
            </MenuSVG>
        )
    }, [walletInfoOpen])

    //refresh
    const Refresh = useCallback(() => {
        return (
            <MenuSVG onClick={refresh} width='64px' minWidth='64px'>
                <SvgIcon
                    sx={{
                        width: '24px',
                        color: "text.primary",
                        animation: "circular-rotate 4s linear infinite",
                        animationPlayState: refreshing ? "running" : "paused",
                        "@keyframes circular-rotate": {
                            from: {
                                transform: "rotate(0deg)",
                                /* 修复 IE11 下的抖动 */
                                transformOrigin: "50% 50%",
                            },
                            to: {
                                transform: "rotate(360deg)",
                            },
                        },
                    }}
                >
                    <Reset />
                </SvgIcon>
            </MenuSVG>
        )
    }, [refreshing])

    //connectwallet
    const ConnectWallet = () => {
        return connected ? <MenuWalletInfo /> : <ConnectButton fullWidth size="small" sx={{
            height: "100%",
            borderRadius: '2px'
        }} />
    }

    //stake hzn
    const StakeNow = () => {
        return (
            <PrimaryButton
                onClick={() => {
                    history.push('mint')
                }}
                sx={{
                    width: '100%',
                    fontSize: '12px',
                    mr: "3px",
                }}
                color='primary'
            >
                STAKE NOW
            </PrimaryButton>
        )
    }

    //get hzn
    const GetHZN = () => {
        return (
            <PrimaryButton
                onClick={() => {
                    updateGetHZNOpen(true)
                }}
                sx={{
                    width: '100%',
                    fontSize: '12px',
                    mr: "3px",
                }}
                color='primary'
            >
                GET HZN
            </PrimaryButton>
        )
    }

    //close menu
    const CloseMenu = () => {
        return (
            <Box onClick={() => {
                setMenuOpen(false)
            }} sx={{
                cursor: 'pointer',
                color: COLOR.text,
                fontSize: '14px',
                height: '44px',
                lineHeight: '44px',
                letterSpacing: '0.5px',
                ml: '10px'
            }}>
                Close Menu
            </Box>
        )
    }

    //wallet info
    const MenuWalletInfo = () => {
        return (
            <WalletInfo
                buttonHeight={44}
                position='absolute'
                top='3px'
                right='3px'
                borderRadius='2px'
            />
        )
    }

    //c-ratio
    const CRatio = () => {
        return (
            <Box onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                setWalletInfoOpen(!walletInfoOpen)
            }} position='relative' sx={{
                cursor: 'pointer',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                position: 'relative',
                mr: "3px",
                px: '3px',
                backgroundColor: COLOR_BG_30
            }}>
                <Typography sx={{
                    fontSize: '10px',
                    lineHeight: '12px',
                    textAlign: 'center',
                    letterSpacing: '1px',
                    color: COLOR.text,
                    opacity: .5
                }}>
                    Current C-Ratio
                </Typography>
                <Typography
                    fontSize={16}
                    letterSpacing='1px'
                    lineHeight='22px'
                    textAlign='center'
                    fontWeight='bold'
                    color={currentCRatioPercent ? color : undefined}
                >
                    {currentCRatioPercent ? formatNumber(currentCRatioPercent) : "--"}%
                </Typography>
                <LinearProgress
                    variant='determinate'
                    value={progress}
                    valueBuffer={currentCRatioPercent}
                    sx={{
                        height: 5,
                        borderRadius: 2,
                        border: `1px solid #11233C`,
                        "&.MuiLinearProgress-colorPrimary": {
                            bgcolor: "transparent",
                        },
                        ".MuiLinearProgress-bar": {
                            bgcolor: color,
                            borderRadius: 0,
                        },
                    }}
                />
                {['25%', '75%'].map((percent, index) => <Box key={index} sx={{
                    position: 'absolute',
                    width: '1px',
                    height: "6px",
                    bottom: '2px',
                    left: percent,
                    backgroundColor: '#11233C'
                }}></Box>)}
            </Box>
        )
    }

    const buttonContent = useMemo(() => {
        if (connected) {
            //no debt, no transferable -> get hzn
            if (transferable.isLessThanOrEqualTo(zeroBN) && debtBalance.isLessThanOrEqualTo(zeroBN)) {
                return (
                    <>
                        <Menu />
                        {menuOpen && <CloseMenu />}
                        {!menuOpen && <Refresh />}
                        {menuOpen ? <MenuWalletInfo /> : <GetHZN />}
                        {!menuOpen && <WalletInfoButton />}
                    </>
                )
            }
            //no debt, has transferable -> stake 
            else if (transferable.gt(zeroBN) && debtBalance.isLessThanOrEqualTo(zeroBN)) {
                return (
                    <>
                        <Menu />
                        {menuOpen && <CloseMenu />}
                        {!menuOpen && <Refresh />}
                        {menuOpen ? <MenuWalletInfo /> : pathname == '/mint' ? <CRatio /> : <StakeNow />}
                        {!menuOpen && <WalletInfoButton />}
                    </>
                )
            }
            //else show ractio - debtBalance.gt(zeroBN)
            else {
                return (
                    <>
                        <Menu />
                        {menuOpen && <CloseMenu />}
                        {!menuOpen && <Refresh />}
                        {menuOpen ? <MenuWalletInfo /> : <CRatio />}
                        {!menuOpen && <WalletInfoButton />}
                    </>
                )
            }
        }
        else {
            return (
                <>
                    <Menu />
                    <Refresh />
                    <ConnectWallet />
                </>
            )
        }
    }, [connected, transferable, debtBalance, menuOpen, walletInfoOpen, walletInfoOpen, account, pathname])

    return (
        <>
            <Box sx={{
                position: 'fixed',
                bottom: 0,
                width: '100%',
                height: '50px',
                zIndex: 99,
                display: 'flex',
                p: "3px",
                backgroundColor: '#0C1D2E'
            }}>
                {buttonContent}
            </Box>
            <MenuDialog
                open={menuOpen}
            // menuOnClose={() => {
            //     setMenuOpen(false)
            // }}
            >
                <MobileMenu menuOnClose={() => {
                    setMenuOpen(false)
                }} />
            </MenuDialog>
            <MenuDialog
                open={walletInfoOpen}
                menuOnClose={() => {
                    // setWalletInfoOpen(false)
                }}
            >
                <Dashboard zIndex={9999} dashBoardOnClose={() => {
                    setWalletInfoOpen(false)
                }} position='absolute' bottom={0} />
            </MenuDialog>
        </>
    )
}