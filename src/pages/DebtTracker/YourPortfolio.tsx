import { Box, BoxProps, Hidden, Typography } from "@mui/material";
import { COLOR } from "@utils/theme/constants";
import PieChart from "./PieChart";
import { formatPercent, formatNumber } from "@utils/number";
import noZasset from "@assets/images/no-zasset.png";
import ConnectButton from "@components/ConnectButton";
import useWallet from "@hooks/useWallet";

const tmpdata = [
    {
        amount: 310.19859657733696,
        amountUSD: 310.19859657733696,
        asset: "USD",
        category: "forex",
        color: "#2AD4B7",
        description: "US Dollars",
        id: "zUSD",
        name: "zUSD",
        percent: 0.6241128959077654,
        sign: "$",
        subclass: "MultiCollateralSynth"
    },
    {
        amount: 0.24656246908695223,
        amountUSD: 96.30988166073054,
        asset: "BNB",
        category: "crypto",
        color: "#3377FF",
        description: "Binance Coin",
        feed: "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526",
        id: "zBNB",
        name: "zBNB",
        percent: 0.19377340778144647,
        sign: "",
        subclass: "MultiCollateralSynth"
    },
    {
        amount: 713.738405863125,
        amountUSD: 90.51473440706862,
        asset: "DOGE",
        category: "crypto",
        color: "#F0B90B",
        description: "DOGE",
        feed: "0x963D5e7f285Cc84ed566C486c3c1bC911291be38",
        id: "zDOGE",
        name: "zDOGE",
        percent: 0.1821136963107882,
        sign: "",
        subclass: "PurgeableSynth"
    },
    {
        amount: 713.738405863125,
        amountUSD: 90.51473440706862,
        asset: "DOGE",
        category: "crypto",
        color: "#F0B90B",
        description: "DOGE",
        feed: "0x963D5e7f285Cc84ed566C486c3c1bC911291be38",
        id: "zDOGE",
        name: "zDOGE",
        percent: 0.1821136963107882,
        sign: "",
        subclass: "PurgeableSynth"
    },
    {
        amount: 713.738405863125,
        amountUSD: 90.51473440706862,
        asset: "DOGE",
        category: "crypto",
        color: "#F0B90B",
        description: "DOGE",
        feed: "0x963D5e7f285Cc84ed566C486c3c1bC911291be38",
        id: "zDOGE",
        name: "zDOGE",
        percent: 0.1821136963107882,
        sign: "",
        subclass: "PurgeableSynth"
    },
]

export default function YourPortfolio() {
    const { connectWallet, connected, deactivate } = useWallet();
    return (
        <Box sx={{
            mt: 2,
            width: {
                xs: '90%',
                sm: '300px',
            },
            height: "300px",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            // backgroundColor: "green",
            // ml: 'auto',
            mr: {
                xs: '0px',
                sm: '-50px',
            }
        }}
        >
            <Typography sx={{
                color: COLOR.text,
                fontSize: '12px',
                fontWeight: 'bold',
                textAlign: 'center',
                lineHeight: '19px',
                mb: 1
            }}>YOUR PORTFOLIO
                <br />
                <span style={{
                    fontWeight: 'normal',
                    opacity: 0.5
                }}>Total zAsset Value: </span><span style={{
                    color: COLOR.safe
                }}>$71.45</span>
            </Typography>
            <ListItem {...{
                text: ["zAssset", "Balance", "Value", "Portfolio %"]
            }} />
            
            {/* {!connected && <ConnectButton fullWidth sx={{
                width:'340px',
                height: '36px'
            }}/>} */}

            {/* <Box sx={{
                display: 'flex',
                fontSize: '12px',
                color: '#5D6588'
            }}><img style={{ marginRight: '9px' }} src={noZasset} />No zAssets</Box> */}

             {tmpdata.map((data, index) =>
                <ListItem {...{
                    text: [
                        data.name,
                        formatNumber(data.amount),
                        formatNumber(data.amountUSD),
                        formatPercent(data?.percent ?? 0)],
                    props: [
                        { color: COLOR.text },
                        { color: COLOR.text, fontWeight: 'bold' },
                        { color: COLOR.text, opacity: .5 },
                        { color: COLOR.text }
                    ],
                    index: index
                }} />
            )}
        </Box>
    )
}

interface ListItemProps {
    text: string[],
    props?: BoxProps[],
    index?: number
}

const ListItem = ({ text, props, index }: ListItemProps) => {
    return (
        <Box key={index} sx={{
            display: 'flex',
            width: '100%',
            height: '59px',
            justifyContent: 'space-around',
            alignItems: 'center',
            backgroundColor: index !== undefined ? index % 2 == 0 ? 'rgba(16, 38, 55, 0.3)' : 'transparent' : 'transparent'
        }}>
            {text.map((item, index) =>
                <Typography sx={{
                    width: '25%',
                    textAlign: 'center',
                    fontSize: '12px',
                    color: '#5D6588',
                    ...props?.[index]
                }}>
                    {item}
                </Typography>
            )}
        </Box>
    )
}