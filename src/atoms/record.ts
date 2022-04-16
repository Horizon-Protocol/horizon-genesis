import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";
import { DebtData, HistoricalClaimHZNAndZusdData, HistoricalOperationData } from "@hooks/query/useQueryDebt";
import { GloablDebt } from "@hooks/query/useQueryGlobalDebt";
import { GlobalZAssetsPoolProps } from "@hooks/useFetchGlobalZAsset";
import { RewardEscrowV2Props } from "@hooks/Escrowed/useEscrowDataQuery";
import { TokenSaleEscrowProps } from "@hooks/Escrowed/useTokenSaleEscrowQuery";

export enum HistoryType {
    All = "All Types",
    Mint = 'Mint',
    Burn = 'Burn',
    Claim = 'Claim'
}

export const globalDebtAtom = atomWithReset<GloablDebt[]>([])

export const globalZAsstesPoolAtom = atom<GlobalZAssetsPoolProps>({ supplyData: [], totalValue: 0 })

export const rewardsEscrowAtom = atomWithReset<RewardEscrowV2Props | null>(null)
export const tokenSaleEscrowAtom = atomWithReset<TokenSaleEscrowProps | null>(null)

export const historicalIssuedDebtAtom = atomWithReset<DebtData[]>([])
export const historicalActualDebtAtom = atomWithReset<DebtData[]>([])
export const historicalOperationAtom = atomWithReset<HistoricalOperationData[] | null>(null)
export const historicalIsLoadingAtom = atomWithReset<boolean>(true)
export const historicalClaimHZNAndZUSDAtom = atomWithReset<HistoricalClaimHZNAndZusdData[]>([])
