import PageCard from "@components/PageCard";
import DebtOverview from "@components/Record/Debt/DebtOverview";
import useReponsiveChart from "@hooks/useReponsiveChart";
import { Box, Typography } from "@mui/material";
import { BarPrice, BusinessDay, ISeriesApi, LineSeriesPartialOptions, PriceFormat } from "lightweight-charts";
import { padStart } from "lodash";
import { COLOR } from "@utils/theme/constants";
import { formatFiatCurrency } from "@utils/number";
import { useState } from "react";

export default function DebtTracker() {

    const [lineSeries, setLineSeries] = useState<ISeriesApi<"Line"> | null>(null);

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

    const setSeriesData = () => {
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
            setSeriesData()

            var toolTip = document.createElement('div');
            toolTip.className = 'floating-tooltip-2';
            container.appendChild(toolTip);

            chart.subscribeCrosshairMove(function(param) {
                if (param != undefined){
                    if (!param.time || param.point.x < 0 || param.point.x > width || param.point.y < 0 || param.point.y > height) {
                        toolTip.style.display = 'none';
                        return;
                    }
                
                    var dateStr = LightweightCharts.isBusinessDay(param.time)
                        ? businessDayToString(param.time)
                        : new Date(param.time * 1000).toLocaleDateString();
                
                    toolTip.style.display = 'block';
                    var price = param.seriesPrices.get(areaSeries);
                    toolTip.innerHTML = '<div style="color: rgba(255, 70, 70, 1)">Apple Inc.</div>' +
                        '<div style="font-size: 24px; margin: 4px 0px">' + Math.round(price * 100) / 100 + '</div>' +
                        '<div>' + dateStr + '</div>';
                
                    var y = param.point.y;
                
                    var left = param.point.x + toolTipMargin;
                    if (left > width - toolTipWidth) {
                        left = param.point.x - toolTipMargin - toolTipWidth;
                    }
                
                    var top = y + toolTipMargin;
                    if (top > height - toolTipHeight) {
                        top = y - toolTipHeight - toolTipMargin;
                    }
                }
                toolTip.style.left = left + 'px';
                toolTip.style.top = top + 'px';
            });
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

            </Box>
        </PageCard>
    )
} 