import horizon from "@lib/horizon";
import { CONTRACT } from "@utils/queryKeys";
import { useCallback, useEffect } from "react";
import { Query, useQuery } from "react-query";
import { readyAtom, suspensionStatusAtom } from "@atoms/app";
import { useAtomValue } from "jotai";
import useHorizonJs from "./useHorizonJs";
import { useUpdateAtom } from "jotai/utils";

export default function useSuspensionStatus(){
    const appReady = useAtomValue(readyAtom);

    const horizonJs = useHorizonJs();
    const setSuspensionStatus = useUpdateAtom(suspensionStatusAtom)

    const fetcher = useCallback(async () => {
        if (appReady) {
            const {
                contracts: { SystemStatus },
            } = horizonJs!;
            const [systemSuspension, issuanceSuspension] = await Promise.all([
                SystemStatus.systemSuspension(),
                SystemStatus.issuanceSuspension(),
            ])
            return {
                systemSuspension,
                issuanceSuspension
            }
        }
    }, [horizonJs,appReady])

    useQuery([CONTRACT],fetcher, {
        onSuccess(status){
            setSuspensionStatus({
                status: status?.systemSuspension[0] || status?.issuanceSuspension[0],
                reason: status?.systemSuspension[1] === status?.issuanceSuspension[1] ? status?.systemSuspension[1] : 0
            })
        },
        onError(error){
            console.log('SuspensionStatuserror',error)
        }
    })
}