import PageCard from "@components/PageCard";
import DebtOverview from "@components/Record/Debt/DebtOverview";
import useReponsiveChart from "@hooks/useReponsiveChart";
import { Box, Typography } from "@mui/material";
import { BarPrice, BusinessDay, IChartApi, ISeriesApi, LineData, LineSeriesPartialOptions, MouseEventParams, Point, PriceFormat, WhitespaceData } from "lightweight-charts";
import { padStart, values } from "lodash";
import { COLOR } from "@utils/theme/constants";
import { formatFiatCurrency, formatNumber } from "@utils/number";
import { useState } from "react";
import dayjs from "dayjs";
import { time } from "console";
import GlobalPortfolio from "./GlobalPortfolio";
import YourPortfolio from "./YourPortfolio";
import { useEffect } from "react";
import { globalDebtAtom, historicalDebtAtom } from "@atoms/record";
import { useAtomValue } from "jotai/utils";
import useWallet from "@hooks/useWallet";

interface ToolTipCellPros {
    color: string;
    title: string;
    value: string;
}

interface ToolTipProps {
    toolTipDisplay: string,
    left?: string,
    top?: string,
    time?: string,
    debts?: ToolTipCellPros[]
}

export default function DebtTracker() {
    const { connected } = useWallet();
    const [toolTipProps, setToolTipProps] = useState<ToolTipProps>({
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
                // return formatFiatCurrency(priceValue, {
                //     prefix: "$",
                //     average: true,
                //     mantissa: 4,
                //     optionalMantissa: true,
                //     spaceSeparated: true
                // });
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

    const [acitveDebtLineSeries, setAcitveDebtLineSeries] = useState<ISeriesApi<"Line"> | null>(null);
    const [isuuedDebtLineSeries, setIsuuedDebtLineSeries] = useState<ISeriesApi<"Line"> | null>(null);
    const [globalDebtLineSeries, setGlobalDebtLineSeries] = useState<ISeriesApi<"Line"> | null>(null);

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

            const isuuedDebt = chart.addLineSeries({
                color: '#2AD4B7',
                priceScaleId: 'left',
                ...leftPriceConfig
            })

            const globalDebt = chart.addLineSeries({
                color: COLOR.warning,
                priceScaleId: 'right',
                ...rightPriceConfig
            })

            setAcitveDebtLineSeries(acitveDebt)
            setIsuuedDebtLineSeries(isuuedDebt)
            setGlobalDebtLineSeries(globalDebt)

            chart.subscribeCrosshairMove((param) => {
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

                // console.log("oncross", {
                //     acitveDebtLineSeries: acitveDebt,
                //     param: param,
                //     chart: chart,
                //     container: container
                // })

                const acitveDebtValue = formatFiatCurrency(param.seriesPrices.get(acitveDebt) as BarPrice, { prefix: "$", mantissa: 2 })
                const issuedDebtValue = formatFiatCurrency(param.seriesPrices.get(isuuedDebt) as BarPrice, { prefix: "$", mantissa: 2 })
                const globalDebtValue = formatFiatCurrency(param.seriesPrices.get(globalDebt) as BarPrice, { prefix: "$", mantissa: 2 })

                const toolTipDispplay = []

                if (acitveDebtValue != "$NaN") {
                    toolTipDispplay.push({
                        color: '#3377FF',
                        title: 'Active Debt',
                        value: acitveDebtValue
                    })
                }
                if (issuedDebtValue != "$NaN") {
                    toolTipDispplay.push({
                        color: '#2AD4B7',
                        title: 'Issued Debt',
                        value: issuedDebtValue
                    })
                }
                if (globalDebtValue != "$NaN") {
                    toolTipDispplay.push({
                        color: '#FFA539',
                        title: 'Global Debt',
                        value: globalDebtValue
                    })
                }

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
                    debts: toolTipDispplay,
                })
            });
        },
        // onCrosshairMove(param, chart, container) {
        // }
    })

    const historicalDebt = useAtomValue(historicalDebtAtom);
    const globalDebt = useAtomValue(globalDebtAtom)

    useEffect(() => {
        if (historicalDebt?.length) {
            const activeRows: (LineData | WhitespaceData)[] = []
            for (let i = historicalDebt.length - 1; i >= 0; i--) {
                var debt = historicalDebt[i]
                const time = dayjs.unix(Number(debt.timestamp / 1000)).format("YYYY-MM-DD")
                if (!activeRows.find(x => x.time == time)) {
                    activeRows.push({
                        time: time,
                        value: Number(debt.actualDebt)
                    })
                }
            }
            // if (historicalDebt.length != 1 && Number(historicalDebt[0].actualDebt) != 0){
            acitveDebtLineSeries?.setData(activeRows.reverse())
            // }

            const issuedRows: (LineData | WhitespaceData)[] = []
            for (let i = historicalDebt.length - 1; i >= 0; i--) {
                var debt = historicalDebt[i]
                const time = dayjs.unix(Number(debt.timestamp / 1000)).format("YYYY-MM-DD")
                if (!issuedRows.find(x => x.time == time)) {
                    issuedRows.push({
                        time: time,
                        value: Number(debt.issuanceDebt)
                    })
                }
            }
            // if (historicalDebt.length != 1 && Number(historicalDebt[0].issuanceDebt) != 0){
            isuuedDebtLineSeries?.setData(issuedRows.reverse())
            // }
        }
    }, [historicalDebt, acitveDebtLineSeries, isuuedDebtLineSeries])

    useEffect(()=>{
        if (globalDebt?.length) {
            const globalRows: (LineData | WhitespaceData)[] = []
            for (let i = globalDebt?.length - 1; i >= 0; i--) {
                var gdebt = globalDebt[i]
                const time = dayjs.unix(Number(gdebt.id)).format("YYYY-MM-DD")
                if (!globalRows.find(x => x.time == time)) {
                    globalRows.push({
                        time: time,
                        value: Number(gdebt.totalDebt)
                    })
                }
                globalDebtLineSeries?.setData(globalRows)
            }
        }
    },[globalDebt,globalDebtLineSeries])

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

interface ToolTipCellPros {
    color: string;
    title: string;
    value: string;
}

interface ToolTipProps {
    toolTipDisplay: string,
    left?: string,
    top?: string,
    time?: string,
    debts?: ToolTipCellPros[]
}

const ToolTip = ({
    toolTipDisplay,
    left,
    top,
    time,
    debts,
}: ToolTipProps) => {
    return (
        <Box sx={{
            width: '224px',
            // height: '112px',
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
                // height: '82px',
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
                        mt: '3px',
                    }}>
                        <Box sx={{
                            height: '10px',
                            width: '10px',
                            backgroundColor: debts[index].color,
                            border: '1px solid #FFFFFF',
                            borderRadius: '50%'
                        }} />
                        <Typography sx={{
                            color: debts[index].color,
                            fontSize: '12px',
                            letterSpacing: '0.5px',
                            ml: '10px'
                        }}>
                            {debts[index].title}
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
                            {debts[index].value}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    )
}