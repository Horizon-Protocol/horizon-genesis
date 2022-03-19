import PageCard from "@components/PageCard";
import DebtOverview from "@components/Record/Debt/DebtOverview";
import useReponsiveChart from "@hooks/useReponsiveChart";
import { Box, Typography } from "@mui/material";
import { BarPrice, BusinessDay, IChartApi, ISeriesApi, LineSeriesPartialOptions, MouseEventParams, Point, PriceFormat } from "lightweight-charts";
import { padStart } from "lodash";
import { COLOR } from "@utils/theme/constants";
import { formatFiatCurrency } from "@utils/number";
import { useState } from "react";
import dayjs from "dayjs";
import { time } from "console";
import GlobalPortfolio from "./GlobalPortfolio";
import YourPortfolio from "./YourPortfolio";
import { useEffect } from "react";

interface ToolTipPros {
    toolTipDisplay: string,
    left?: string,
    top?: string,
    time?: string,
    debts?: string[]
}

export default function DebtTracker() {

    const [acitveDebtLineSeries, setAcitveDebtLineSeries] = useState<ISeriesApi<"Line"> | null>(null);
    const [isuuedDebtLineSeries, setIsuuedDebtLineSeries] = useState<ISeriesApi<"Line"> | null>(null);
    const [globalDebtLineSeries, setGlobalDebtLineSeries] = useState<ISeriesApi<"Line"> | null>(null);

    const [toolTipProps, setToolTipProps] = useState<ToolTipPros>({
        toolTipDisplay: 'none',
        left: '0',
        top: '0',
        time: '',
        debts: []
    })

    const leftPriceConfig: Partial<LineSeriesPartialOptions> = {
        lineWidth: 2,
        scaleMargins: {
            top: 0.2,
            bottom: 0.1,
        },
        priceFormat: {
            type: "custom",
            formatter(priceValue: BarPrice) {
                //   return priceValue + "dsds"
                return formatFiatCurrency(priceValue, { prefix: "$" });
            },
        },
    }

    const rightPriceConfig: Partial<LineSeriesPartialOptions> = {
        lineWidth: 2,
        scaleMargins: {
            top: 0.2,
            bottom: 0.1,
        },
        priceFormat: {
            type: "custom",
            formatter(priceValue: BarPrice) {
                //   return priceValue + "dsds"
                return formatFiatCurrency(priceValue, {
                    prefix: "$",
                    average: true,
                    mantissa: 2,
                    optionalMantissa: true,
                    spaceSeparated: true
                });
            },
        },
    }

    // const setSeriesData = (chart: IChartApi) => {
    //     const acitveDebt = chart.addLineSeries({
    //         color: '#3377FF',
    //         priceScaleId: 'left',
    //         ...leftPriceConfig
    //     })
    //     setAcitveDebtLineSeries(acitveDebt)

    //     const isuuedDebt = chart.addLineSeries({
    //         color: '#2AD4B7',
    //         priceScaleId: 'left',
    //         ...leftPriceConfig
    //     })
    //     setIsuuedDebtLineSeries(isuuedDebt)

    //     const globalDebt = chart.addLineSeries({
    //         color: COLOR.warning,
    //         priceScaleId: 'right',
    //         ...rightPriceConfig
    //     })
    //     setGlobalDebtLineSeries(globalDebt)
    // }

    const { bindRef } = useReponsiveChart({
        rightPriceScale: {
            visible: false
        },
        leftPriceScale: {
            visible: false
        },
        timeScale: {
            fixLeftEdge: true,
            barSpacing: 50,
            tickMarkFormatter: ({ month, day }: BusinessDay) => {
                return `${padStart(String(month), 2, "0")}/${padStart(
                    String(day),
                    2,
                    "0"
                )}`;
            },
        },
        crosshair: {
            horzLine: {
                visible: false,
                labelVisible: false,
            },
            vertLine: {
                labelVisible: false,
            },
        },
        onReady(chart, container) {
            const acitveDebt = chart.addLineSeries({
                color: '#3377FF',
                priceScaleId: 'left',
                ...leftPriceConfig
            })
            setAcitveDebtLineSeries(acitveDebt)
    
            const isuuedDebt = chart.addLineSeries({
                color: '#2AD4B7',
                priceScaleId: 'left',
                ...leftPriceConfig
            })
            setIsuuedDebtLineSeries(isuuedDebt)
    
            const globalDebt = chart.addLineSeries({
                color: COLOR.warning,
                priceScaleId: 'right',
                ...rightPriceConfig
            })
            setGlobalDebtLineSeries(globalDebt)
        },
        onCrosshairMove(param, chart, container) {
            const width = container?.clientWidth as number
            const height = container?.clientHeight as number
            const toolTipWidth = 224
            const toolTipHeight = 112
            const toolTipMargin = 10
            const leftPriceWidth = 48
            const rightPriceWidth = 62

            let point = param.point as Point
            if (!param.time || point.x < 0 || point.x > width || point.y < 0 || point.y > height) {
                setToolTipProps({ toolTipDisplay: 'none' })
                return;
            }

            let x = point?.x
            let y = point?.y

            let left = x - toolTipWidth - toolTipMargin + leftPriceWidth
            if (x < (toolTipMargin + toolTipWidth)) {
                left = left + toolTipWidth + 2 * toolTipMargin
            }

            let top = y - toolTipHeight - toolTipMargin;
            if (top < 0) {
                top = top + 2 * toolTipMargin + toolTipHeight;
            }

            const businessTime = param.time as BusinessDay
            // console.log('========chartparam=======',param.seriesPrices[0])
            
            setToolTipProps({
                toolTipDisplay: 'block',
                left: left + 'px',
                top: top + 'px',
                time: dayjs(
                    new Date(
                        businessTime.year,
                        businessTime.month - 1,
                        businessTime.day
                    )
                ).format("MMM D, YYYY"),
                debts: ["$62.91", "$32.92", "$3002320.91",],
            })
        }
    })

    useEffect(()=>{
        setTimeout(() => {
            acitveDebtLineSeries?.setData([
                { time: { year: 2021, month: 7, day: 4 }, value: 14.5 },
                { time: { year: 2021, month: 7, day: 5 }, value: 19 },
                { time: { year: 2021, month: 7, day: 6 }, value: 16.5 },
                { time: { year: 2021, month: 7, day: 7 }, value: 51 },
                { time: { year: 2021, month: 7, day: 8 }, value: 30.3 },
                { time: { year: 2021, month: 7, day: 9 }, value: 26 },
                { time: { year: 2021, month: 7, day: 10 }, value: 44 },
            ])
            isuuedDebtLineSeries?.setData([
                { time: { year: 2021, month: 7, day: 4 }, value: 10.5 },
                { time: { year: 2021, month: 7, day: 5 }, value: 10 },
                { time: { year: 2021, month: 7, day: 6 }, value: 8 },
                { time: { year: 2021, month: 7, day: 7 }, value: 42 },
                { time: { year: 2021, month: 7, day: 8 }, value: 22 },
                { time: { year: 2021, month: 7, day: 9 }, value: 17 },
                { time: { year: 2021, month: 7, day: 10 }, value: 38 },
            ])
            globalDebtLineSeries?.setData([
                { time: { year: 2021, month: 7, day: 4 }, value: 7164343 },
                { time: { year: 2021, month: 7, day: 5 }, value: 1366123 },
                { time: { year: 2021, month: 7, day: 6 }, value: 1997123 },
                { time: { year: 2021, month: 7, day: 7 }, value: 1528123 },
                { time: { year: 2021, month: 7, day: 8 }, value: 1412123 },
                { time: { year: 2021, month: 7, day: 9 }, value: 2003123 },
                { time: { year: 2021, month: 7, day: 10 }, value: 3843434 },
            ])
        }, );
    },[acitveDebtLineSeries,isuuedDebtLineSeries,globalDebtLineSeries])

    return (
        <PageCard
            mx='auto'
            // color={THEME_COLOR}
            // headerBg={headerBg}
            title='Debt Tracker'
            description={
                <>
                    Track your debt over time and compare your<br />
                    debt to the global debt.
                </>
            }
        >
            <DebtOverview />
            <Typography sx={{ fontSize: "12px", color: COLOR.text, textAlign: "center", mt: 3 }}>DEBT OVER TIME</Typography>
            <Box position="relative" ref={bindRef} sx={{
                mt: "5px",
                width: document.body.clientWidth < 500 ? document.body.clientWidth : 570,//  window.innerWidth < 400 ? window.innerWidth - 50 : 570,
                height: "250px",
                alignSelf: "center",
            }}>
                <ToolTip {...toolTipProps} />
            </Box>
            <Box sx={{
                mt: 2,
                display: 'flex',
                flexDirection: {
                    xs: 'column',
                    sm: 'row'
                },
                alignItems: 'center',
                justifyContent: 'space-around'
            }}>
                <GlobalPortfolio />
                <YourPortfolio /> 
            </Box>
        </PageCard>
    )
}

const ToolTip = ({
    toolTipDisplay,
    left,
    top,
    time,
    debts,
}: ToolTipPros) => {
    return (
        <Box sx={{
            width: '224px',
            height: '112px',
            position: 'absolute',
            display: toolTipDisplay,
            fontSize: '12px',
            color: '#131722',
            zIndex: 1000,
            top: top,
            left: left,
            backgroundColor: '#11192A',
            borderRadius: '2px'
        }}>
            <Typography sx={{
                textAlign: 'center',
                color: 'white',
                py: 'auto',
                fontSize: '12px',
                lineHeight: '30px',
                letterSpacing: '1px'
            }}>{time}</Typography>
            <Box sx={{
                height: '82px',
                width: '100%',
                backgroundColor: 'rgba(16, 38, 55, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                px: '12px',
                py: '10px',
                justifyContent: 'space-between'
            }}>
                {debts?.map((value, index) => (
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        <Box sx={{
                            height: '10px',
                            width: '10px',
                            backgroundColor: ['#3377FF', '#2AD4B7', '#FFA539'][index],
                            border: '1px solid #FFFFFF',
                            borderRadius: '50%'
                        }} />
                        <Typography sx={{
                            color: ['#3377FF', '#2AD4B7', '#FFA539'][index],
                            fontSize: '12px',
                            letterSpacing: '0.5px',
                            ml: '10px'
                        }}>
                            {['Active Debt', 'Issued Debt', 'Global Debt'][index]}
                        </Typography>
                        <Typography sx={{
                            color: COLOR.text,
                            fontSize: '12px',
                            letterSpacing: '0.5px',
                            // mr: '0px',
                            ml: 'auto',
                            textAlign: 'right',
                            // backgroundColor:'red'
                        }}>
                            {debts[index]}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    )
}