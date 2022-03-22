import { GRAPH_DEBT } from "@utils/queryKeys";
import { QueryFunction, useQuery } from "react-query";
import requset, { gql } from "graphql-request"
import { GRAPH_ENDPOINT } from "@utils/constants";
import useWallet from "@hooks/useWallet";
import { useCallback } from "react";

export default function useQueryDebt() {

    const { account } = useWallet()

    const issues = async () => {
        return await requset(
            GRAPH_ENDPOINT,
            // "https://api.thegraph.com/subgraphs/name/synthetixio-team/synthetix",
            gql
                `
                query{
                    issueds(
                    first:1000,
                    orderBy:timestamp,
                    orderDirection:desc,
                    where: {
                        account: ${account}
                    }){
                    id
                    timestamp
                    value
                    }
                }
            `
        )
    }

    const burneds = async () => {
        return await requset(
            GRAPH_ENDPOINT,
            // "https://api.thegraph.com/subgraphs/name/synthetixio-team/synthetix",
            gql
                `
                query{
                    burneds(
                    first:1000,
                    orderBy:timestamp,
                    orderDirection:desc,
                    where: {
                        account: ${account}
                    }){
                    id
                    timestamp
                    value
                    }
                }
            `
        )
    }

    const fetcher = useCallback(async ()=>{
        // const res = await Promise.all([
        //     issues,
        //     // burneds
        // ])
        // alert('zz')
        const res = await requset(
            GRAPH_ENDPOINT,
            // "https://api.thegraph.com/subgraphs/name/synthetixio-team/synthetix",
            gql
                `
                query{
                    issueds(
                    first:1000,
                    orderBy:timestamp,
                    orderDirection:desc,
                    where: {
                        account: ${account}
                    }){
                    id
                    timestamp
                    value
                    }
                }
            `
        )

        console.log("======useQueryDebt=====",res)


        return res
    },[])
    
    useQuery([GRAPH_DEBT, 'historyDebt'], fetcher, {
        onSuccess(
          value1,
        //   value2,
        ) {
            
            console.log("======useQueryDebt=====",value1)

        },
      });
}
