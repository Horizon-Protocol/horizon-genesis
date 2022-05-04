import { Box, BoxProps, Dialog, Fade, LinearProgress, Link, Popover, PopoverProps, Slide, Typography } from "@mui/material";
import { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import { useAtom } from "jotai";
import { useAtomValue } from "jotai/utils";
import PrimaryButton from "@components/PrimaryButton";
import { COLOR_BG_50, COLOR_BG_30, COLOR_BG } from "@utils/theme/constants";
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
import { ReactComponent as CakeHzn } from "@assets/images/cake-gethzn.svg";
import { ReactComponent as MexcHzn } from "@assets/images/mexc-gethzn.svg";
import { ReactComponent as HooHzn } from "@assets/images/hoo-gethzn.svg";
import WalletInfo from "../Header/WalletInfo";
import MobileMenu from "./MobileMenu";
import { currentCRatioPercentAtom, debtAtom } from "@atoms/debt";
import { zeroBN } from "@utils/number";
import useCRactioProgress from "@hooks/useCRactioProgress";
import { COLOR } from "@utils/theme/constants";
import { formatNumber } from "@utils/formatters";
import { fontSize } from "@mui/system";
import MenuSVG from "./MobileMenu/MenuSVG";
import GetHZNDialog from "./MobileMenu/GetHZNDialog";
import MenuItem from "@components/Header/HelpMenu/MenuItem";
import { alpha } from "@mui/material/styles";
import Dashboard from "@components/Dashboard";
import MenuDialog from "./MobileMenu/MenuDialog";
interface GetHZNProps {
    svg: JSX.Element;
    title: string;
    href: string;
}

const GetHZNs = [
    {
        svg: <CakeHzn />,
        title: 'PancakeSwap', href: 'https://pancakeswap.finance/swap#/swap?outputCurrency=0xc0eff7749b125444953ef89682201fb8c6a917cd'
    },
    {
        svg: <MexcHzn />,
        title: 'MEXC Global', href: 'https://www.mexc.com/zh-CN/exchange/HZN_USDT'
    },
    {
        svg: <HooHzn />,
        title: 'Hoo.com', href: 'https://hoo.com/innovation/hzn-usdt'
    },
]

export default function MobileFooter() {

    const history = useHistory()
    const { refreshing } = useIsRefrshing();
    const { connected, account } = useWallet();
    const refresh = useRefresh()
    const { pathname } = useLocation();

    //menu and wallet info popover
    //menu popover
    const [menuOpen, setMenuOpen] = useAtom(footerMenuOpenAtom)
    //walletinfo popover
    const [walletInfoOpen, setWalletInfoOpen] = useAtom(footerMenuWalletInfoOpenAtom)
    //get hzn dialog
    const [getHZNOpen, setGetHZNOpen] = useAtom(footerMenuGetHZNOpenAtom)
    //progress
    const { transferable, debtBalance } = useAtomValue(debtAtom);
    const { progress, color } = useCRactioProgress()
    const currentCRatioPercent = useAtomValue(currentCRatioPercentAtom);

    //menu
    const Menu = useCallback(() => {
        return (
            <MenuSVG width='64px' onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                setMenuOpen(!menuOpen)
            }}>
                {menuOpen ? (
                    <SvgIcon sx={{
                        width: '16px'
                    }}>
                        <Union />
                    </SvgIcon>
                ) : (
                    <SvgIcon>
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
                width='64px'
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
            <MenuSVG onClick={refresh} width='64px'>
                <SvgIcon
                    sx={{
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
        return connected ? <WalletInfo /> : <ConnectButton fullWidth size="small" sx={{ height: "100%" }} />
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
                    setGetHZNOpen(true)
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
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                mr: '3px',
                flexGrow: 1,
            }}>
                <WalletInfo />
            </Box>
        )
    }

    //c-ratio
    const CRatio = () => {
        return (
            <Box onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                setWalletInfoOpen(true)
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
                        borderRadius: 1,
                        border: `1px solid ${COLOR.border}`,
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
                    height: "5px",
                    bottom: '2px',
                    left: percent,
                    backgroundColor: COLOR_BG
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
                height: '3.124rem',
                zIndex: 99,
                display: 'flex',
                p: ".1875rem",
                backgroundColor: '#0C1D2E'
            }}>
                {buttonContent}
            </Box>
            <MenuDialog
                open={getHZNOpen}
                menuOnClose={() => {
                    setGetHZNOpen(false)
                }}
            >

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    height: "100%",
                    mx: '18px',
                }}>
                    <Box sx={{
                        backgroundColor: '#0C1D2E',
                    }}>
                        <Box sx={{
                            // width: '340px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Typography sx={{
                                // width: '100%',
                                flexGrow: 1,
                                height: "44px",
                                textAlign: 'center',
                                lineHeight: '44px',
                                backgroundColor: COLOR_BG_30,
                                fontSize: '16px',
                                fontWeight: 'bold',
                                mr: '3px',
                                color: COLOR.safe
                            }}>
                                GET HZN
                            </Typography>
                            <MenuSVG onClick={() => {
                                setGetHZNOpen(false)
                            }}
                                sx={{
                                    width: '44px',
                                    height: '44px',
                                    mr: '0px',
                                    cursor: 'pointer'
                                }}
                            >
                                <SvgIcon sx={{ width: '11px' }}>
                                    <Union />
                                </SvgIcon>
                            </MenuSVG>
                        </Box>
                        {GetHZNs.map((item, index) => {
                            return (
                                <Link key={index}
                                    href={item.href}
                                    target="_blank"
                                    underline="none"
                                >
                                    <MenuItem sx={{
                                        opacity: 1,
                                        mt: '3px',
                                        backgroundColor: 'rgba(16, 38, 55, 0.3)',
                                        color: COLOR.text,
                                        px: 2.5,
                                        py: 1.5,
                                        height: 64,
                                        // width: 340,
                                        paddingX: '14px'
                                    }} svgSx={{
                                        color: alpha(COLOR.text, .5),
                                    }} isLink>
                                        <SvgIcon sx={{ height: 30, width: 30, mr: '12px' }}>
                                            {item.svg}
                                        </SvgIcon>
                                        <Box fontWeight={700}>{item.title}</Box>
                                    </MenuItem>
                                </Link>
                            )
                        })}
                    </Box>
                </Box>
            </MenuDialog>
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
                    setWalletInfoOpen(false)
                }}
            >
                <Dashboard zIndex={9999} dashBoardOnClose={() => {
                    setWalletInfoOpen(false)
                }} position='absolute' bottom={0} />
            </MenuDialog>
        </>
    )
}