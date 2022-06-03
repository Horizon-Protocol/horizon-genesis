//this class is for initialed the chart with ref and set configuration

import {
    ChartOptions, createChart, DeepPartial, IChartApi, MouseEventParams,
} from "lightweight-charts";
import { defaultsDeep } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { COLOR } from "@utils/theme/constants";
import useResizeObserver from "use-resize-observer";

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
        borderColor: '#222331',
    },
    leftPriceScale: {
        visible: true,
        // lineWidth: '1px',
        borderColor: '#222331',
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
        textColor: 'rgba(180, 224, 255, .5)',
        fontFamily: "Rawline",
        fontSize: 10,
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
    crosshair: {
        horzLine: {
            visible: false,
            labelVisible: false
        },
        // vertLine: {
        //     visible: true,
        //     style: 0,
        //     width: 2,
        //     color: 'rgba(32, 38, 46, 0.1)',
        //     labelVisible: false,
        // }
    },
}


export default function useReponsiveChart(
    props: ChartProps & DeepPartial<ChartOptions>
) {
    const { onReady, onCrosshairMove, ...options } = props || {}
    const chartRef = useRef<HTMLDivElement | null>(null)
    // const chartInstanceRef = useRef<IChartApi | null>(null);

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
            chart.applyOptions({
                handleScale: {
                    axisPressedMouseMove: {
                        time: true,
                        price: false,
                    },
                },
            });
            onReady?.(chart, chartRef.current)
        }
    }, [onReady, chartRef])

    useEffect(() => {
        initChart()
        return () => {
            chartRef.current?.remove();
            chartRef.current = null;
        };
    }, [])

    return {
        bindRef(instance: HTMLDivElement) {
            // containerRef(instance)   
            chartRef.current = instance
        }
    }
}

