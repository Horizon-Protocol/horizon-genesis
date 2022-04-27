import PageCard from "@components/PageCard";
import DebtOverview from "@components/Record/Debt/DebtOverview";
import useReponsiveChart from "@hooks/useReponsiveChart";
import { Box, Typography } from "@mui/material";
import { BarPrice, BusinessDay, IChartApi, isBusinessDay, ISeriesApi, LineData, LineSeriesPartialOptions, MouseEventParams, Point, PriceFormat, WhitespaceData } from "lightweight-charts";
import { max, maxBy, minBy, padStart, takeRight } from "lodash";
import { COLOR } from "@utils/theme/constants";
import { formatFiatCurrency, toBN, zeroBN } from "@utils/number";
import { useCallback, useRef, useState } from "react";
import dayjs from "dayjs";
import GlobalPortfolio from "./GlobalPortfolio";
import YourPortfolio from "./YourPortfolio";
import { useEffect } from "react";
import { globalDebtAtom, historicalActualDebtAtom, historicalIssuedDebtAtom } from "@atoms/record";
import { useAtomValue } from "jotai/utils";
import useWallet from "@hooks/useWallet";
import { debtAtom } from "@atoms/debt";
import { useMemo } from "react";
import ToolTip, { ToolTipProps } from "./DebtChartTooltip"
import { DebtData } from "@hooks/query/useQueryDebt";
import { GloablDebt } from "@hooks/query/useQueryGlobalDebt";

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

export default function DebtTracker() {
    const { connected, account } = useWallet();
    const [toolTipProps, setToolTipProps] = useState<ToolTipProps>({
        toolTipDisplay: 'none',
        left: '0',
        top: '0',
        time: '',
        debts: []
    })

    const [chart, setChart] = useState<IChartApi>();
    const [acitveDebtLineSeries, setAcitveDebtLineSeries] = useState<ISeriesApi<"Line"> | null>(null);
    const [isuuedDebtLineSeries, setIsuuedDebtLineSeries] = useState<ISeriesApi<"Line"> | null>(null);
    const [globalDebtLineSeries, setGlobalDebtLineSeries] = useState<ISeriesApi<"Line"> | null>(null);

    const historicalIssuedDebt = useAtomValue(historicalIssuedDebtAtom);
    const historicalActualDebt = useAtomValue(historicalActualDebtAtom);
    const globalDebt = useAtomValue(globalDebtAtom)
    const { debtBalance } = useAtomValue(debtAtom);

    //cause active debt hitorical data need to add the last active data, so need to check the last active debt and activehistorydebt in dep
    const EmptyActiveIsuuedDebtData = useCallback<() => LineData[]>(() => {
        let emptyData: LineData[] = []
        for (let i = 0; i < 30; i++) {
            const temp = (new Date()).getTime()
            const today = dayjs(new Date())
            const targetDay = today.subtract(i, 'day')
            emptyData.push({
                time: targetDay.format("YYYY-MM-DD"),
                value: 0,
            })
        }
        return connected ? emptyData.reverse() : []
    },[connected])

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
                priceLineVisible: false,
                lastValueVisible: false,
                color: '#3377FF',
                priceScaleId: 'left',
                ...leftPriceConfig
            })

            const isuuedDebt = chart.addLineSeries({
                priceLineVisible: false,
                lastValueVisible: false,
                color: '#2AD4B7',
                priceScaleId: 'left',
                ...leftPriceConfig
            })

            const globalDebt = chart.addLineSeries({
                priceLineVisible: false,
                lastValueVisible: false,
                color: COLOR.warning,
                priceScaleId: 'right',
                ...rightPriceConfig
            })

            setChart(chart)
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
    })

    //max data length
    const seriesDataMaxLength = useMemo(() => {
        let maxLength = 30
        if (historicalIssuedDebt.length > 0 || historicalActualDebt.length > 0) {
            const todayDate = dayjs(new Date())
            const maxIssuedLength = historicalIssuedDebt.length > 0 ? todayDate.diff(historicalIssuedDebt[0].timestamp * 1000, 'day') + 2 : 0
            const maxActualLength = historicalActualDebt.length > 0 ? todayDate.diff(historicalActualDebt[0].timestamp * 1000, 'day') + 2 : 0
            const maxValue = max([maxLength,maxIssuedLength,maxActualLength])
            if (maxValue != undefined){
                maxLength = maxValue
            }
        }
        return maxLength
    }, [historicalIssuedDebt, historicalActualDebt, globalDebt])

    const preHistoricalIssuedDebtLength = useRef<Number>(0)
    const preHistoricalActualDebtLength = useRef<Number>(0)
    const preGlobalActualDebtLength = useRef<Number>(0)
    const preDebtBalance = useRef<BN>(zeroBN)

    useEffect(()=>{
        // setActiveLoading(preHistoricalIssuedDebtLength.current != historicalIssuedDebt.length)
        if (preHistoricalIssuedDebtLength.current == historicalIssuedDebt.length &&
            preHistoricalActualDebtLength.current == historicalActualDebt.length &&
            preGlobalActualDebtLength.current == globalDebt?.length &&
            debtBalance.isEqualTo(preDebtBalance.current)){
                return
        }
        // console.log({ })
        const issuedDebtData = takeRight(leftSeriesData(historicalIssuedDebt),seriesDataMaxLength)
        const activeDebtData = takeRight(leftSeriesData(historicalActualDebt, true),seriesDataMaxLength)
        const globalDebtData = takeRight(rightSeriesData(globalDebt),seriesDataMaxLength)
       
        if (isuuedDebtLineSeries) {
            isuuedDebtLineSeries.setData(issuedDebtData)
            preHistoricalIssuedDebtLength.current = historicalIssuedDebt.length
        }
        if (acitveDebtLineSeries) {
            acitveDebtLineSeries.setData(activeDebtData)
            preHistoricalActualDebtLength.current = historicalActualDebt.length
        }
        if (globalDebtLineSeries) {
            globalDebtLineSeries.setData(globalDebtData)
            preGlobalActualDebtLength.current = globalDebt.length
        }
        //set Y-range
        setYRange(isuuedDebtLineSeries,issuedDebtData)
        setYRange(acitveDebtLineSeries,activeDebtData)
        setYRange(globalDebtLineSeries,globalDebtData)
        
        //set X-range load all three series firstdata and lastdata, get the min and max date
        if (chart != null 
            && chart != undefined 
            ) {
                let maxTimeArr = []
                if (issuedDebtData.length > 0 ){
                    maxTimeArr.push(issuedDebtData[0].time)
                }
                if (activeDebtData.length > 0 ){
                    maxTimeArr.push(activeDebtData[0].time)
                }
                if (globalDebtData.length > 0 ){
                    maxTimeArr.push(globalDebtData[0].time)
                }
                let maxStart = (max(maxTimeArr) as BusinessDay)
                const newdate = new Date(maxStart.year, maxStart.month - 1, maxStart.day)
                const substractDay = dayjs(newdate).subtract(5,'day').format("YYYY-MM-DD")
                console.log('maxdate',{
                    maxStart: maxStart,
                    newdate: newdate,
                    year: (maxStart as BusinessDay).year,
                    month: (maxStart as BusinessDay).month,
                    day: (maxStart as BusinessDay).day,
                    substractDay: substractDay,
                })
                chart.timeScale().setVisibleRange({
                    from: maxStart ? substractDay : dayjs(new Date()).format("YYYY-MM-DD"),
                    to: dayjs(new Date()).format("YYYY-MM-DD"),
                });
        }
    },[
        historicalIssuedDebt, 
        historicalActualDebt, 
        globalDebt,
        isuuedDebtLineSeries,
        acitveDebtLineSeries,
        globalDebtLineSeries,
        debtBalance,
        seriesDataMaxLength,
        connected
    ])

    useEffect(()=>{
        if (!connected){
            if (isuuedDebtLineSeries) {
                isuuedDebtLineSeries.setData([])
                preHistoricalIssuedDebtLength.current = -1
            }
            if (acitveDebtLineSeries) {
                acitveDebtLineSeries.setData([])
                preHistoricalActualDebtLength.current = -1
            }
        }else{
            // tt()
            // queryClient.cancelQueries([GRAPH_DEBT,'activeaissued'])
            // queryClient.fetchQuery([GRAPH_DEBT,'activeaissued'])
        }
    },[connected])

    const leftSeriesData = (debtData: DebtData[], addLastActiveDebt?: boolean) => {
        // generate data
        let seriesData: LineData[] = []
        //zero month data
        if (debtData.length <= 0 || !connected) {
            seriesData = EmptyActiveIsuuedDebtData()
        } else {
            const seriesRows: LineData[] = []
            for (let i = debtData.length - 1; i >= 0; i--) {
                var debt = debtData[i]
                const time = dayjs.unix(Number(debt.timestamp)).format("YYYY-MM-DD")
                if (!seriesRows.find(x => x.time == time) && debt.debt != undefined) {
                    seriesRows.push({
                        time: time,
                        value: Number(debt.debt)
                    })
                }
            }
            seriesData = seriesRows.reverse()
            if (addLastActiveDebt){
                seriesData.push({
                    time: dayjs.unix(Number(new Date().getTime() / 1000)).format("YYYY-MM-DD"),
                    value: Number(debtBalance)
                })
                preDebtBalance.current = debtBalance
            }
        }
        return fillEmptyDayData(seriesData)
    }

    const rightSeriesData = (globalDebtData: GloablDebt[] | null) => {
        let seriesData: LineData[] = []
        if (globalDebtData?.length) {
            const globalRows: LineData[] = []
            for (let i = globalDebtData?.length - 1; i >= 0; i--) {
                var gdebt = globalDebtData[i]
                const time = dayjs.unix(Number(gdebt.id)).format("YYYY-MM-DD")
                if (!globalRows.find(x => x.time == time) && gdebt.totalDebt != undefined) {
                    globalRows.push({
                        time: time,
                        value: Number(gdebt.totalDebt)
                    })
                }
            }
            seriesData = globalRows
        }
        return fillEmptyDayData(seriesData)
    }

    const fillEmptyDayData = (data: LineData[]) => {
        if (data.length <= 0){
            return
        }
        //fill the empty date data from the first date to today
        //dayjs today
        let todayDate = dayjs(new Date())
        //dayjs the first day
        let firstTime = ((data[0] as LineData).time as string)
        let firstDate = dayjs(firstTime)
        //duration day
        const totolDay = todayDate.diff(firstDate, 'day') + 1
        const fullyData: LineData[] = []
        let preValue: number = 0
        for (let i = 0; i < totolDay; i++) {
            const targetDate = firstDate.add(i, 'day')
            const targetDateFormat = targetDate.format("YYYY-MM-DD")
            const dataItem = data.find(item => dayjs(item.time as string).format("YYYY-MM-DD") == targetDateFormat)
            if (dataItem) {
                preValue = dataItem.value
                fullyData.push(dataItem)
            } else {
                fullyData.push({
                    time: targetDateFormat,
                    value: preValue
                })
            }
        }
        return fullyData
    }

    const setYRange = (series: ISeriesApi<"Line"> | null, data: LineData[]) => {
        //get maximum and minimum - Y-axis
        if (data.length <= 0){
            return
        }
        let maximumValue = Number((maxBy(data, 'value') as LineData).value)
        let minimumValue = Number((minBy(data, 'value') as LineData).value)
        if (maximumValue == 0 && minimumValue == 0) {
            maximumValue = 100;
        }
        series?.applyOptions({
            ...series.options,
            autoscaleInfoProvider: () => ({
                priceRange: {
                    minValue: minimumValue,
                    maxValue: maximumValue,
                },
                margins: {
                    above: 0,
                    below: 0,
                },
            }),
        })
    }

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
            <Typography sx={{ letterSpacing:'1px', fontWeight:'bold', fontSize: "12px", color: COLOR.text, textAlign: "center", mt: 3 }}>DEBT OVER TIME</Typography>
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

