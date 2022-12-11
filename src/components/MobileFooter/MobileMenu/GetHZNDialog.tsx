import { footerMenuGetHZNOpenAtom } from "@atoms/app"
import { Box, Typography, Link } from "@mui/material"
import { useAtom, useAtomValue } from "jotai"
import MenuDialog from "./MenuDialog"
import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as Union } from "@assets/images/Union.svg";
import { ReactComponent as CakeHzn } from "@assets/images/cake-gethzn.svg";
import { ReactComponent as MexcHzn } from "@assets/images/mexc-gethzn.svg";
import { ReactComponent as HooHzn } from "@assets/images/hoo-gethzn.svg";
import MenuSVG from "./MenuSVG";
import { COLOR_BG_50, COLOR, COLOR_BG_30, COLOR_BG } from "@utils/theme/constants";
import MenuItem from "@components/Header/HelpMenu/MenuItem";
import { alpha } from "@mui/material/styles";

const GetHZNs = [
    {
        svg: <CakeHzn />,
        title: 'PancakeSwap', href: 'https://pancakeswap.finance/swap?outputCurrency=0xc0eff7749b125444953ef89682201fb8c6a917cd'
    },
    {
        svg: <MexcHzn />,
        title: 'MEXC Global', href: 'https://www.mexc.com/exchange/HZN_USDT'
    }
]

export default function GetHZNDialog(){
    const [getHZNOpen, setGetHZNOpen] = useAtom(footerMenuGetHZNOpenAtom)

    return (
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
            // mx: '18px',
            mx:'auto',
            minWidth: '339px'
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
    )
}