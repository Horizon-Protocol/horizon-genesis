import { Box, Typography } from "@mui/material";
import { COLOR } from "@utils/theme/constants";
import PieChart from "./PieChart";
import { formatPercent, formatNumber } from "@utils/number";

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

export default function GlobalPortfolio() {
    return (
        <Box sx={{
            width: '230px',
            height: "300px",
            // backgroundColor: "red",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 2,
            ml: {
                xs: '0px',
                sm: '-50px',
            }
        }}
        >
            <Typography sx={{
                color: COLOR.text,
                fontSize: '12px',
                fontWeight: 'bold'
            }}>GLOBAL PORTFOLIO</Typography>
            <PieChart rows={tmpdata} />
            <Box sx={{
                width: '100%',
                justifyContent:'center',
                display: 'flex',
                flexWrap: 'wrap'
            }}>
                {tmpdata.map((item,index) =>
                    <Box key={index} sx={{
                        mt:'10px',
                        display: 'flex',
                    }}>
                        <Box sx={{
                            mt: '1px',
                            ml: index == 0 ? '0px' : '10px',
                            width: '12px',
                            height: '12px',
                            borderRadius: '2px',
                            backgroundColor: item.color
                        }} />
                        <Typography sx={{
                            ml: '5px',
                            fontWeight: 'bold',
                            color: COLOR.text,
                            fontSize: '12px',
                            lineHeight: '16px'
                        }}>
                            {formatPercent(item?.percent ?? 0)}%
                            <br/>
                            <span style={{
                                fontWeight: 'normal',
                                opacity: .5
                            }}>zUSD</span>
                        </Typography>
                    </Box>
                )}
            </Box>

        </Box>
    )
}