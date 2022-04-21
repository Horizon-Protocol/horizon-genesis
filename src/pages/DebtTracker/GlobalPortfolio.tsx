import { Box, Typography } from "@mui/material";
import { COLOR , PORTFOLIO_COLORS} from "@utils/theme/constants";
import PieChart from "./PieChart";
import { formatPercent, formatNumber } from "@utils/number";
import { useEffect, useMemo } from "react";
import useFetchGlobalZAsset from "@hooks/useFetchGlobalZAsset";
import { useAtomValue } from "jotai/utils";
import { globalZAsstesPoolAtom } from "@atoms/record";
import { sortBy, takeRight, sumBy } from "lodash"

export default function GlobalPortfolio() {
    useFetchGlobalZAsset()

    const globalZAsstesPool = useAtomValue(globalZAsstesPoolAtom)

    const topZAssets = useMemo(() => {
        const topFour = takeRight(sortBy(globalZAsstesPool.supplyData, "value"), 4)

        const totalValue = sumBy(globalZAsstesPool.supplyData, "value")
        const totalSupply = sumBy(globalZAsstesPool.supplyData, "totalSupply")

        const topFourSumValue = sumBy(topFour, "value")
        const topFourSumSupply = sumBy(topFour, "totalSupply")

        const othersValue = totalValue - topFourSumValue
        const othersPercent = 1 - sumBy(topFour, "percent")
        const otherName = "Others"
        const otherSupply = totalSupply - topFourSumSupply

        topFour.push({
            name: otherName,
            totalSupply: otherSupply,
            value: othersValue,
            percent: othersPercent
        })

        const dd = sortBy(topFour,"percent").reverse().map((item,index) => {
            return (
                {
                    ...item,
                    color: PORTFOLIO_COLORS[index]
                }
            )
        })
        
        return dd
    }, [globalZAsstesPool])

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
                fontWeight: 'bold',
                letterSpacing:'1px'
            }}>GLOBAL PORTFOLIO</Typography>
            <PieChart rows={topZAssets} />
            <Box sx={{
                width: '100%',
                justifyContent: 'center',
                display: 'flex',
                flexWrap: 'wrap'
            }}>
                {topZAssets.map((item,index) =>
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
                            }}>{item.name}</span>
                        </Typography>
                    </Box>
                )}
            </Box>

        </Box>
    )
}