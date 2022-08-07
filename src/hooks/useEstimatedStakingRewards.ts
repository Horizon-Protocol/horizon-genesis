import { readyAtom } from "@atoms/app";
import { weekStakingPoolRewardsAtom } from "@atoms/feePool";
import { REFETCH_INTERVAL } from "@utils/constants";
import { useAtomValue } from "jotai";
import { useUpdateAtom } from "jotai/utils";
import { useCallback } from "react";
import { useQuery } from "react-query";
import useHorizonJs from "./useHorizonJs";

export default function useEstimatedStakingRewards() {
    
    const appReady = useAtomValue(readyAtom);
    const horizonJs = useHorizonJs();

    const updateEstimatedStakingRewards = useUpdateAtom(weekStakingPoolRewardsAtom)

    // console.log('horizonJs', horizonJs)
    const fetcherWeekCounter = useCallback(async () => {
        if (appReady) {
            const {
                contracts: { SupplySchedule },
            } = horizonJs!;
            return await SupplySchedule.weekCounter()
        }
    }, [appReady, horizonJs])
    const weekCounter = useQuery(['fetcherWeekCounter'], fetcherWeekCounter)
    // console.log('fetcherWeekCounter', weekCounter?.data?.toNumber())

    const fetcherTokenDecaySupplyForWeek = useCallback(async () => {
        if (appReady && !!weekCounter.data) {
            const week = weekCounter.data.toNumber() - 39
            const {
                contracts: { SupplySchedule },
            } = horizonJs!;
            return await SupplySchedule.tokenDecaySupplyForWeek(week)
        }
    }, [appReady, weekCounter, horizonJs])
    const decaySupplyForWeek = useQuery(['fetcherTokenDecaySupplyForWeek'], fetcherTokenDecaySupplyForWeek, { enabled: !!weekCounter.data })
    // console.log('fetcherTokenDecaySupplyForWeek', Number(decaySupplyForWeek.data) / 1e18)

    const fetcherRewardsDistributionLength = useCallback(async () => {
        if (appReady) {
            const {
                contracts: { RewardsDistribution },
            } = horizonJs!;
            return await RewardsDistribution.distributionsLength()
        }
    }, [appReady,horizonJs])
    const distributionsQeuryRies = useQuery(['fetcherRewardsDistributionLength'], fetcherRewardsDistributionLength)
    // console.log('distributionsLength',distributionsQeuryRies.data?.toNumber())

    const rewardsDistribution = useCallback(async () => {
        if (appReady && !!distributionsQeuryRies.data) {
            const {
                contracts: { RewardsDistribution },
            } = horizonJs!;
            const arr = []
            for (let i = 0;i < distributionsQeuryRies.data.toNumber();i++){
                arr.push(RewardsDistribution.distributions(i.toString()))
            }
            return await Promise.all(arr)
        }
    }, [appReady, distributionsQeuryRies,horizonJs])
    useQuery(['distributions'], rewardsDistribution, {
        refetchInterval: REFETCH_INTERVAL,
        onSuccess(res) {
            let distributionAmount = 0
            res?.forEach((element) => {
                distributionAmount += Number(element[1]) / 1e18
            });
            // console.log('distributionAmount', distributionAmount)

            const weekDecaySupply = Number(decaySupplyForWeek.data) / 1e18
            // console.log('weekDecaySupply', weekDecaySupply)

            const realAmount = weekDecaySupply - distributionAmount
            updateEstimatedStakingRewards(realAmount)
            console.log('===useEstimatedStakingRewards', realAmount)
        },
        enabled: !!distributionsQeuryRies.data && !!decaySupplyForWeek.data
    })

}