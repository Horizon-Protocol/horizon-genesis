import { readyAtom } from "@atoms/app";
import { zAssetsBalanceInfoAtom } from "@atoms/balances";
import horizon from "@lib/horizon";
import { useAtomValue } from "jotai/utils";
import { values } from "lodash";
import { useMemo } from "react";

interface FilterParams {
    category?: string;
    keyword?: string;
    zUSDIncluded?: boolean
}

export default function useFilterZAssets({
    category,
    keyword,
    zUSDIncluded,
}: FilterParams) {
    const ready = useAtomValue(readyAtom)
    const zAssetsBalanceInfo = useAtomValue(zAssetsBalanceInfoAtom);

    const filteredZAssets = useMemo<ZAssetsBalanceInfo[]>(() => {
        if (!ready) {
            return []
        }
        // const zAssets = values(horizon.synthsMap) || [];
        return zAssetsBalanceInfo.filter((z) => {
            if (!zUSDIncluded && z.name === "zUSD") {
                return false;
            }

            if (category && z.category !== category) {
                return false;
            }

            if (
                keyword &&
                z.name?.toLowerCase().indexOf(keyword.toLowerCase()) === -1 &&
                z.description?.toLowerCase().indexOf(keyword.toLowerCase()) === -1
            ) {
                return false;
            }
            return true;
        });
    }, [ready, zUSDIncluded, category, keyword]);
    return filteredZAssets
}