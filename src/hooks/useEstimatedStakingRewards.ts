import { readyAtom } from "@atoms/app";
import { BNToEther, toBN } from "@utils/number";
import { CONTRACT } from "@utils/queryKeys";
import { useAtomValue } from "jotai";
import { useCallback } from "react";
import { useQuery } from "react-query";
import useHorizonJs from "./useHorizonJs";

export default function useEstimatedStakingRewards() {

    const appReady = useAtomValue(readyAtom);

    const horizonJs = useHorizonJs();
    // console.log('horizonJs', horizonJs)
    const fetcherWeekCounter = useCallback(async () => {
        if (appReady) {
            const {
                contracts: { SupplySchedule },
            } = horizonJs!;
            return await SupplySchedule.weekCounter()
        }
    }, [appReady])

    const weekCounter = useQuery(['weekCounter'], fetcherWeekCounter)
    // console.log('weekCounter', weekCounter?.data?.toNumber())

    const fetcherTokenDecaySupplyForWeek = useCallback(async () => {
        if (appReady && weekCounter) {
            let week = weekCounter.data.toNumber() - 39
            const {
                contracts: { SupplySchedule },
            } = horizonJs!;
            return await SupplySchedule.tokenDecaySupplyForWeek(BNToEther(toBN(week)))
        }
    }, [weekCounter])
    const decaySupplyForWeek = useQuery(
        ['tokenDecaySupplyForWeek'],
        fetcherTokenDecaySupplyForWeek,
        {
            onSuccess(res){
                console.log('decaySupplyForWeek', res)
            },
            onError(err){
                console.log('decayerr', err)
            },
            enabled: !!weekCounter
        }
    )

}