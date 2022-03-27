import { readyAtom } from "@atoms/app";
import horizon from "@lib/horizon";
import { formatNumber, toBN, zeroBN } from "@utils/number";
import { GRAPH_DEBT, CONTRACT, PUBLIC } from "@utils/queryKeys";
import { useAtomValue, useResetAtom, useUpdateAtom } from "jotai/utils";
import { useCallback, useEffect } from "react";
import { useQuery } from "react-query";
import { utils, BigNumberish } from "ethers";
import { globalZAsstesPoolAtom } from "@atoms/record";

export type GlobalSupplyDataProps = {
    name?: CurrencyKey | string;
    totalSupply: number;
    value: number;
    percent?: number | 0;
    color?: string;
}

export type GlobalZAssetsPoolProps = {
    supplyData: GlobalSupplyDataProps[];
    totalValue: number;
}

export default function useFetchGlobalZAsset() {

    const setGlobalZAssetsPool = useUpdateAtom(globalZAsstesPoolAtom);

    const appReady = useAtomValue(readyAtom);

    const fetcher = useCallback(async () => {
        if (appReady) {
            const {
                contracts: { SynthUtil },
            } = horizon.js!;
            const result = await SynthUtil.synthsTotalSupplies()
            return result
        }
    }, [appReady])

    useQuery([GRAPH_DEBT, PUBLIC, "globalZAsset"], fetcher, {
        onSuccess(synthTotalSupplies) {
            const supplyData:GlobalSupplyDataProps[] = [];
            let totalValue = 0;

            for (let i = 0; i < synthTotalSupplies[0].length; i++) {
                const value = Number(synthTotalSupplies[2][i]) / 1e18;
                const name = utils.parseBytes32String(synthTotalSupplies[0][i]) as CurrencyKey;
                const totalSupply =  Number(synthTotalSupplies[1][i]) / 1e18;

                supplyData.push({
                    name,
                    totalSupply,
                    value,
                });
                totalValue = totalValue + value;
            }

            const filterSupplyData = supplyData.map((item,index) => {
                return ({
                    ...item,
                    percent:item.value / totalValue
                })
            }).filter((z) => {
                if (z.value <= 0){
                    return false
                }
                return true;
            });

            console.log("===useFetchGlobalZAsseterror", filterSupplyData);

            setGlobalZAssetsPool({
                supplyData: filterSupplyData,
                totalValue: totalValue
            })
        },
        onError(error) {
            console.log("useFetchGlobalZAsseterror", error);
        }
    });
}