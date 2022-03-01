import PageCard from "@components/PageCard";
import DebtOverview from "@components/Record/Debt/DebtOverview";
import useReponsiveChart from "@hooks/useReponsiveChart";
import { Box, Typography } from "@mui/material";
import { BarPrice, BusinessDay, IChartApi, ISeriesApi, LineSeriesPartialOptions, MouseEventParams, Point, PriceFormat } from "lightweight-charts";
import { padStart } from "lodash";
import { COLOR } from "@utils/theme/constants";
import { formatFiatCurrency } from "@utils/number";
import { useState } from "react";

interface ToolTipPros {
    toolTipDisplay: string,
    left?: string,
    top?: string,
    time?: string,
    debts?: string[]
}

export default function DebtTracker() {

    // const [lineSeries, setLineSeries] = useState<ISeriesApi<"Line"> | null>(null);
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

    const setSeriesData = (chart: IChartApi) => {
        const acitveDebt = chart.addLineSeries({
            color: '#3377FF',
            priceScaleId: 'left',
            ...leftPriceConfig
        })
        acitveDebt.setData([
            { time: { year: 2021, month: 7, day: 4 }, value: 14.5 },
            { time: { year: 2021, month: 7, day: 5 }, value: 19 },
            { time: { year: 2021, month: 7, day: 6 }, value: 16.5 },
            { time: { year: 2021, month: 7, day: 7 }, value: 51 },
            { time: { year: 2021, month: 7, day: 8 }, value: 30.3 },
            { time: { year: 2021, month: 7, day: 9 }, value: 26 },
            { time: { year: 2021, month: 7, day: 10 }, value: 44 },
        ])

        const isuuedDebt = chart.addLineSeries({
            color: '#2AD4B7',
            priceScaleId: 'left',
            ...leftPriceConfig

        })
        isuuedDebt.setData([
            { time: { year: 2021, month: 7, day: 4 }, value: 10.5 },
            { time: { year: 2021, month: 7, day: 5 }, value: 10 },
            { time: { year: 2021, month: 7, day: 6 }, value: 8 },
            { time: { year: 2021, month: 7, day: 7 }, value: 42 },
            { time: { year: 2021, month: 7, day: 8 }, value: 22 },
            { time: { year: 2021, month: 7, day: 9 }, value: 17 },
            { time: { year: 2021, month: 7, day: 10 }, value: 38 },
        ])



        const globalDebt = chart.addLineSeries({
            color: COLOR.warning,
            priceScaleId: 'right',
            ...rightPriceConfig
        })
        globalDebt.setData([
            { time: { year: 2021, month: 7, day: 4 }, value: 7164343 },
            { time: { year: 2021, month: 7, day: 5 }, value: 1366123 },
            { time: { year: 2021, month: 7, day: 6 }, value: 1997123 },
            { time: { year: 2021, month: 7, day: 7 }, value: 1528123 },
            { time: { year: 2021, month: 7, day: 8 }, value: 1412123 },
            { time: { year: 2021, month: 7, day: 9 }, value: 2003123 },
            { time: { year: 2021, month: 7, day: 10 }, value: 3843434 },
        ])
    }

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
            setSeriesData(chart)
        },
        onCrosshairMove(param, chart, container) {
            const width = container?.clientWidth as number
            const height = container?.clientHeight as number
            const toolTipWidth = 96
            const toolTipHeight = 80
            const toolTipMargin = 10

            let point = param.point as Point
            if (!param.time || point.x < 0 || point.x > width || point.y < 0 || point.y > height) {
                setToolTipProps({ toolTipDisplay: 'none' })
                return;
            }

            let x = point?.x
            let y = point?.y

            let left = x - toolTipWidth/2 - toolTipMargin
            // if (left > width - toolTipWidth) {
            //     left = point.x - toolTipMargin - toolTipWidth;
            // }

            let top = y - toolTipHeight - toolTipMargin;
            // if (top > height - toolTipHeight) {
            //     top = y - toolTipHeight - toolTipMargin;
            // }
            setToolTipProps({
                toolTipDisplay: 'block',
                left: left + 'px',
                top: top + 'px',
                time: '',
                debts: []
            })
            //                 hoveredMarkerId: undefined
            // hoveredSeries: undefined
            // point:
            // x: 188
            // y: 134.515625
            // [[Prototype]]: Object
            // seriesPrices: Map(3)
            // [[Entries]]
            // 0: {t => 51}
            // 1: {t => 42}
            // 2: {t => 1528123}
            // size: 3
            // [[Prototype]]: Map
            // time:
            // day: 7
            // month: 7
            // year: 2021
            // [[Prototype]]: Ob
            // console.log("===subscribeCrosshairMove===", param)
        }
    })


    return (
        <PageCard
            mx='auto'
            // color={THEME_COLOR}
            // headerBg={headerBg}
            title='Debt Tracker '
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
                mt: "31px",
                width: "574px",
                height: "250px",
                // backgroundColor:"red",
                alignSelf: "center"
            }}>
                <ToolTip {...toolTipProps} />
            </Box>
        </PageCard>
    )
}

const ToolTip = ({ toolTipDisplay, left, top, time, debts }: ToolTipPros) => {
    return (
        <Box sx={{
            width: '96px',
            height: '80px',
            position: 'absolute',
            display: toolTipDisplay,
            padding: '8px',
            fontSize: '12px',
            color: '#131722',
            zIndex: 1000,
            top: top,
            left: left,
            backgroundColor: 'red'
        }}>
            测试
        </Box>
    )
}