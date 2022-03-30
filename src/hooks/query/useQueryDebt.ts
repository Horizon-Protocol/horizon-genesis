import { GRAPH_DEBT } from "@utils/queryKeys";
import { useQuery } from "react-query";
import request, { gql } from 'graphql-request';
import { GRAPH_ENDPOINT } from "@utils/constants";
import { useCallback } from "react";
import useWallet from "@hooks/useWallet";
import { concat, flattenDeep, last, sortBy } from "lodash";
import { toBN } from "@utils/number";
import { useAtomValue, useResetAtom, useUpdateAtom } from "jotai/utils";
import { debtAtom } from "@atoms/debt";
import useDisconnected from "@hooks/useDisconnected";
import { historicalClaimHZNAndZUSDAtom, historicalDebtAtom, historicalOperationAtom, HistoryType } from "@atoms/record";

export type HistoricalDebtAndIssuanceData = {
    timestamp: number;
    actualDebt: BN;
    issuanceDebt: BN;
    index: number;
};

export type HistoricalOperationData = {
    id: string
    type: HistoryType,
    timestamp: string;
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
    const { debtBalance } = useAtomValue(debtAtom);

    const setHistoricalDebt = useUpdateAtom(historicalDebtAtom);
    const resetHistoricalDebt = useResetAtom(historicalDebtAtom);
    useDisconnected(resetHistoricalDebt);

    const setHistoricalOperation = useUpdateAtom(historicalOperationAtom);
    const resetHistoricalOperation = useResetAtom(historicalOperationAtom);
    useDisconnected(resetHistoricalOperation);

    const setHistoricalClaim = useUpdateAtom(historicalClaimHZNAndZUSDAtom);
    const resetHistoricalClaim = useResetAtom(historicalOperationAtom);
    useDisconnected(resetHistoricalClaim);
    
    const issueds = async () => {
        try {
            const issuesReponse = await request(
                GRAPH_ENDPOINT,
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
            console.log("issuesReponse",issuesReponse.issueds)
            return issuesReponse
        } catch (e) {
            console.log("query报错",e)
            return [];
        }
    }

    const burneds = async () => {
        try {
            const burnedsReponse = await request(
                GRAPH_ENDPOINT,
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
            console.log("burnedsReponse",burnedsReponse.burneds )
            return burnedsReponse
        } catch (e) {
            console.log("query报错",e)
            return [];
        }
    }

    const claims = async () => {
        try {
            const claimsReponse = await request(
                GRAPH_ENDPOINT,
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
            console.log("claimsReponse",claimsReponse )
            return claimsReponse
        } catch (e) {
            console.log("query报错",e)
            return [];
        }
    }

    const debtSnapshots = async () => {
        try {
            const debtSnapshotsReponse = await request(
                GRAPH_ENDPOINT,
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
            // console.log("debtSnapshotsReponse",debtSnapshotsReponse)
            return debtSnapshotsReponse
        } catch (e) {
            console.log("query报错",e)
            return [];
        }
    }

    const fetcher = useCallback(async () => {
        const res = await Promise.all([
            issueds(),
            burneds(),
            claims(),
            debtSnapshots()
        ]);
        return res;
    }, [account])

    useQuery(
        [GRAPH_DEBT, 'historyDebt'],
        fetcher
        , {
            // initialData: [],
            onSuccess([
                issues,
                burns,
                claims,
                debtSnapshot
            ]) {
                let issuesAndBurns = issues.issueds!.map((b:any) => ({ isBurn: false, ...b }));
                issuesAndBurns = sortBy(
                    issuesAndBurns.concat(burns.burneds!.map((b:any) => ({ isBurn: true, ...b }))),
                    (d) => {
                        return d.timestamp
                    }
                );

                //============== load record of (Claimed/Burned/Minted) ==================//
                /* abstract cliams and calculate all the claim record for HZN and zUSD(come from exchange fee) */ 
                setHistoricalClaim(claims.feesClaimeds)
                /* --------------------------- */ 
                let typeMintHistory = issues.issueds.map((b:any) => ({...b, type: HistoryType.Mint }))
                let typeBurnHistory = burns.burneds.map((b:any) => ({ ...b, type: HistoryType.Burn }))
                let typeClaimHistory = claims.feesClaimeds.map((b:any) => ({ ...b, type: HistoryType.Claim, value: b.rewards }))
                const allTypeHistory = sortBy(concat(typeMintHistory,typeBurnHistory,typeClaimHistory),"timestamp")
                setHistoricalOperation(allTypeHistory)
                //==============================================================================

                const debtHistory = debtSnapshot.debtSnapshots ?? [];
                // We set historicalIssuanceAggregation array, to store all the cumulative
                // values of every mint and burns
                const historicalIssuanceAggregation: BN[] = [];

                issuesAndBurns.slice().forEach((event:any) => {
                    const eventValue = toBN(event.value)

                    const multiplier = event.isBurn ? -1 : 1;
                    const aggregation = eventValue
                        .multipliedBy(multiplier)
                        .plus(last(historicalIssuanceAggregation) ?? toBN(0));

                    historicalIssuanceAggregation.push(aggregation);
                });

                // We merge both actual & issuance debt into an array
                let historicalDebtAndIssuance: HistoricalDebtAndIssuanceData[] = [];
                debtHistory
                    .slice()
                    .reverse()
                    .forEach((debtSnapshot:any, i:number) => {
                        historicalDebtAndIssuance.push({
                            timestamp: debtSnapshot.timestamp * 1000,
                            issuanceDebt: historicalIssuanceAggregation[i],
                            actualDebt: toBN(debtSnapshot.debtBalanceOf || 0),
                            index: i,
                        });
                    });

                // Last occurrence is the current state of the debt
                // Issuance debt = last occurrence of the historicalDebtAndIssuance array
                historicalDebtAndIssuance.push({
                    timestamp: new Date().getTime(),
                    actualDebt: debtBalance || toBN(0),
                    issuanceDebt: last(historicalIssuanceAggregation) ?? toBN(0),
                    index: historicalDebtAndIssuance.length,
                });

                // console.log("===historicalDebtAndIssuance",historicalDebtAndIssuance)
                setHistoricalDebt(historicalDebtAndIssuance)
            }
        }
    )
}
