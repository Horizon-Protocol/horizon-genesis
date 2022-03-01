//this class is for initialed the chart with ref and set configuration

import {
    ChartOptions, createChart, DeepPartial, IChartApi, MouseEventParams,
} from "lightweight-charts";
import { defaultsDeep } from "lodash";
import { useCallback, useEffect, useRef } from "react";
import { COLOR } from "@utils/theme/constants";

interface ChartProps {
    //onready will be called when chart initialized finished,  IChartApi implemented all chart function，
    onReady?(
        chart: IChartApi, 
        chartContainer: HTMLElement
        ): void,

    onCrosshairMove?(
        param: MouseEventParams,
        chart: IChartApi, 
        chartContainer: HTMLElement | null
    ): void
}

const defaultChartOptions: DeepPartial<ChartOptions> = {
    localization: { locale: "en" },
    rightPriceScale: {
        visible: true,
        borderColor: 'rgba(197, 203, 206, 1)',
    },
    leftPriceScale: {
        visible: true,
        borderColor: 'rgba(197, 203, 206, 1)',
    },
    overlayPriceScales: {
        borderColor: "#222331",
        scaleMargins: {
            top: 0.2,
            bottom: 0.3,
        },
    },
    timeScale: {
        borderColor: "#222331",
    },
    layout: {
        backgroundColor: "transparent",
        textColor: COLOR.text,
        fontFamily: "Rawline",
    },
    grid: {
        vertLines: {
            visible: false,
        },
        horzLines: {
            visible: true,
            color: "#222331",
        },
    },
}

export default function useReponsiveChart(
    props: ChartProps & DeepPartial<ChartOptions>
) {
    const { onReady, onCrosshairMove, ...options } = props || {}
    const chartRef = useRef<HTMLDivElement | null>(null)

    const initChart = useCallback(() => {
        if (chartRef.current) {

            const width = chartRef.current?.clientWidth
            const height = chartRef.current?.clientHeight

            const chart = createChart(
                chartRef.current,
                defaultsDeep(
                    defaultChartOptions,
                    {
                        width: width,
                        height: height
                    },
                    options
                )
            );
            chart.subscribeCrosshairMove((param) => {
                if (param != null && param != undefined){
                    onCrosshairMove?.(param, chart, chartRef.current)
                }
            });

            onReady?.(chart, chartRef.current)
        }
    }, [onReady, chartRef])

    useEffect(() => {
        initChart()
    }, [])

    return {
        bindRef(instance: HTMLDivElement) {
            chartRef.current = instance
        }
    }
}

