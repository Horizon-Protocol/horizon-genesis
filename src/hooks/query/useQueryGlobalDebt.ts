import { GRAPH_DEBT } from "@utils/queryKeys";
import { useQuery } from "react-query";
import requset, { gql } from "graphql-request"
import { GRAPH_ENDPOINT } from "@utils/constants";
import { useCallback } from "react";
import useWallet from "@hooks/useWallet";
import { last, sortBy } from "lodash";
import { toBN } from "@utils/number";
import { useAtomValue, useResetAtom, useUpdateAtom } from "jotai/utils";
import { debtAtom } from "@atoms/debt";
import { formatNumber } from "@utils/number";
import useDisconnected from "@hooks/useDisconnected";
import dayjs from "dayjs";
import { globalDebtAtom } from "@atoms/record";

export type GloablDebt = {
    id: string;
    totalDebt: string;
    value: string;
};

export default function useQueryGlobalDebt() {
    const { account } = useWallet()
    const { debtBalance } = useAtomValue(debtAtom);

    const setGlobalDebtAtom = useUpdateAtom(globalDebtAtom);
    const resetGlobalDebtAtom = useResetAtom(globalDebtAtom);
    useDisconnected(resetGlobalDebtAtom);
    
    const globalDebts = async () => {
        try {
            const globalDebtsReponse = await requset(
                // GRAPH_ENDPOINT,
                "https://api.thegraph.com/subgraphs/name/rout-horizon/bsc4-issuance",
                gql
                    `
                    query{
                        dailyIssueds(
                        first:1000,
                        orderBy: id,
                        orderDirection: desc,
                        ){
                        id
                        value
                        totalDebt
                        }
                    }
                `
            )
            console.log("===globalDebts",globalDebtsReponse)
            return globalDebtsReponse
        } catch (e) {
            return [];
        }
    }

    useQuery(
        [GRAPH_DEBT, 'globalDebts'],
        globalDebts
        , {
            initialData: [],
            onSuccess(
                debts,
            ) {
                // console.log("globalDebtsReponse",debts.dailyIssueds)
                setGlobalDebtAtom(debts.dailyIssueds ?? [])
            }            
        }
    )
}
