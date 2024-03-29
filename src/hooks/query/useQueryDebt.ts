import { GRAPH_DEBT } from "@utils/queryKeys";
import { useQuery } from "react-query";
import request, { gql } from 'graphql-request';
import { GRAPH_ENDPOINT } from "@utils/constants";
import { useCallback } from "react";
import useWallet from "@hooks/useWallet";
import { concat, last, sortBy } from "lodash";
import { toBN } from "@utils/number";
import { useResetAtom, useUpdateAtom } from "jotai/utils";
import { useAtom } from "jotai";
import useDisconnected from "@hooks/useDisconnected";
import { historicalActualDebtAtom, historicalClaimHZNAndZUSDAtom, historicalIsLoadingAtom, historicalIssuedDebtAtom, historicalOperationAtom, HistoryType } from "@atoms/record";

export type DebtData = {
    timestamp: number;
    debt: BN;
};

export type HistoricalOperationData = {
    id: string
    type: HistoryType,
    timestamp: string;
    rewards?: string;
    value: string;
};

export type HistoricalClaimHZNAndZusdData = {
    id: string,
    timestamp: string,
    rewards: string,
    value: string,
}

export default function useQueryDebt() {
    const { account } = useWallet()

    const [historicalIssuedDebt, setHistoricalIssuedDebt] = useAtom(historicalIssuedDebtAtom);
    const resetHistoricalIssuedDebt = useResetAtom(historicalIssuedDebtAtom);
    useDisconnected(resetHistoricalIssuedDebt);

    const [historicalActualDebt, setHistoricalActualDebt] = useAtom(historicalActualDebtAtom);
    const resetHistoricalActualDebt = useResetAtom(historicalActualDebtAtom);
    useDisconnected(resetHistoricalActualDebt);

    const setHistoricalOperation = useUpdateAtom(historicalOperationAtom);
    const resetHistoricalOperation = useResetAtom(historicalOperationAtom);
    useDisconnected(resetHistoricalOperation);
    const setHistoricalIsLoading = useUpdateAtom(historicalIsLoadingAtom)
    const resetHistoricalIsLoading = useResetAtom(historicalIsLoadingAtom);
    useDisconnected(resetHistoricalIsLoading);

    const setHistoricalClaim = useUpdateAtom(historicalClaimHZNAndZUSDAtom);
    const resetHistoricalClaim = useResetAtom(historicalOperationAtom);
    useDisconnected(resetHistoricalClaim);

    const issueds = useCallback(async () => {
        try {
            // console.log('fetch account',account)
            const issuesReponse = await request(
                GRAPH_ENDPOINT(),
                gql
                    `
                    query{
                        issueds(
                        first:1000,
                        orderBy: timestamp,
                        orderDirection: desc,
                        where: {
                            account: "${account}"
                        }){
                        account
                        source
                        gasPrice
                        block
                        id
                        timestamp
                        value
                        }
                    }
                `
            )
            console.log('debt account',account)
            // console.log("issuesReponse",issuesReponse.issueds)
            return issuesReponse
        } catch (e) {
            console.log("query报错issuesReponse", e)
            return [];
        }
    },[account])

    const burneds = useCallback(async () => {
        try {
            const burnedsReponse = await request(
                GRAPH_ENDPOINT(),
                gql
                    `
                    query{
                        burneds(
                        first:1000,
                        orderBy: timestamp,
                        orderDirection: desc,
                        where: {
                            account: "${account}"
                        }){
                        id
                        timestamp
                        value
                        }
                    }
                `
            )
            // console.log("burnedsReponse", burnedsReponse.burneds)
            return burnedsReponse
        } catch (e) {
            console.log("query报错burnedsReponse", e)
            return [];
        }
    },[account])

    const claims = useCallback(async () => {
        try {
            const claimsReponse = await request(
                GRAPH_ENDPOINT(),
                gql
                    `
                    query{
                        feesClaimeds(
                        first:1000,
                        orderBy: timestamp,
                        orderDirection: desc,
                        where: {
                            account: "${account}"
                        }){
                        id
                        timestamp
                        rewards
                        value
                        }
                    }
                `
            )
            // console.log("claimsReponse", claimsReponse)
            return claimsReponse
        } catch (e) {
            console.log("query报错claimsReponse", e)
            return [];
        }
    },[account])

    const debtSnapshots = useCallback(async () => {
        try {
            const debtSnapshotsReponse = await request(
                GRAPH_ENDPOINT(),
                gql
                    `
                    query{
                        debtSnapshots(
                        first:1000,
                        orderBy: timestamp,
                        orderDirection: desc,
                        where: {
                            account: "${account}"
                        }){
                        id
                        timestamp
                        debtBalanceOf
                        }
                    }
                `
            )
            // console.log("debtSnapshotsReponse", debtSnapshotsReponse)
            return debtSnapshotsReponse
        } catch (e) {
            console.log("query报错debtSnapshotsReponse", e)
            return [];
        }
    },[account])

    const fetcher = useCallback(async () => {
        const res = await Promise.all([
            issueds(),
            burneds(),
            claims(),
            debtSnapshots()
        ]);
        return res;
    }, [burneds, claims, debtSnapshots, issueds])

    return useQuery(
        [GRAPH_DEBT,'activeaissuesd'],
        fetcher
        , {
            enabled: !!account,
            onSuccess([
                issues,
                burns,
                claims,
                debtSnapshot
            ]) {
                console.log('===useQueryDebt')
                // console.log('active debt and issued debt request finished',{
                //     account,
                //     issues,
                //     burns,
                //     claims,
                //     debtSnapshot
                // })
                let issuesAndBurns = issues.issueds!.map((b: any) => ({ isBurn: false, ...b }));
                issuesAndBurns = sortBy(
                    issuesAndBurns.concat(burns.burneds!.map((b: any) => ({ isBurn: true, ...b }))),
                    (d) => {
                        return d.timestamp
                    }
                );

                //============== load record of (Claimed/Burned/Minted) ==================//
                /* abstract cliams and calculate all the claim record for HZN and zUSD(come from exchange fee) */
                setHistoricalClaim(claims.feesClaimeds)
                /* --------------------------- */
                const typeMintHistory = issues.issueds.map((b: any) => ({ ...b, type: HistoryType.Mint }))
                const typeBurnHistory = burns.burneds.map((b: any) => ({ ...b, type: HistoryType.Burn }))
                const typeClaimHistory = claims.feesClaimeds.map((b: any) => ({ ...b, type: HistoryType.Claim }))
                const concatData = concat(typeMintHistory, typeBurnHistory, typeClaimHistory)
                const allTypeHistory = sortBy(concatData, "timestamp")
                // console.log("====allTypeHistory", allTypeHistory)

                //if user has data and more than 0, loading end
                if (allTypeHistory.length > 0){
                    setHistoricalIsLoading(false)
                }
                setHistoricalOperation(prev => {
                    if (allTypeHistory.length == 0 && prev?.length == 0){
                        //means this user doesn't has any record history, let user to stake
                        setHistoricalIsLoading(false)
                    }
                    return (
                        allTypeHistory
                    )
                })
                //==============================================================================

                // We set historicalIssuanceAggregation array, to store all the cumulative ===========================================================
                // values of every mint and burns
                const historicalIssuanceAggregation: DebtData[] = [];
                issuesAndBurns.slice().forEach((event: any) => {
                    const eventValue = toBN(event.value)

                    const multiplier = event.isBurn ? -1 : 1;
                    const aggregation = eventValue
                        .multipliedBy(multiplier)
                        .plus(last(historicalIssuanceAggregation)?.debt ?? toBN(0));

                    historicalIssuanceAggregation.push({
                        timestamp: Number(event.timestamp),
                        debt: aggregation
                    });
                });

                if (historicalIssuanceAggregation.length != historicalIssuedDebt.length){
                    setHistoricalIssuedDebt(historicalIssuanceAggregation)
                }

                // We merge both actual & issuance debt into an array ===========================================================
                const debtHistory = debtSnapshot.debtSnapshots ?? [];
                const historicalActualDebtRecord: DebtData[] = [];
                debtHistory
                    .slice()
                    .reverse()
                    .forEach((debtSnapshot: any, i: number) => {
                        historicalActualDebtRecord.push({
                            timestamp: debtSnapshot.timestamp,
                            debt: toBN(debtSnapshot.debtBalanceOf || 0),
                        });
                    });
              
                if (debtSnapshot.debtSnapshots.length != historicalActualDebt.length){
                    setHistoricalActualDebt(historicalActualDebtRecord)
                }
            }
        }
    )
}
