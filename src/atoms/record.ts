import { atom } from "jotai";
import { atomWithReset, atomWithStorage } from "jotai/utils";
import { HistoricalClaimHZNAndZusdData, HistoricalDebtAndIssuanceData, HistoricalOperationData } from "@hooks/query/useQueryDebt";
import { GloablDebt } from "@hooks/query/useQueryGlobalDebt";
import { GlobalZAssetsPoolProps } from "@hooks/useFetchGlobalZAsset";
import { RewardEscrowV2Props } from "@hooks/Escrowed/useEscrowDataQuery";
import { TokenSaleEscrowProps } from "@hooks/Escrowed/useTokenSaleEscrowQuery";

export enum HistoryType{
    All = "All Types",
    Mint = 'Mint',
    Burn = 'Burn',
    Claim = 'Claim'
}

export const globalDebtAtom = atomWithReset<GloablDebt[] | null>([])

export const globalZAsstesPoolAtom = atom<GlobalZAssetsPoolProps>({supplyData:[], totalValue: 0})

export const rewardsEscrowAtom = atomWithReset<RewardEscrowV2Props | null>(null)
export const tokenSaleEscrowAtom = atomWithReset<TokenSaleEscrowProps | null>(null)

export const historicalDebtAtom = atomWithReset<HistoricalDebtAndIssuanceData[] | null>([])
export const historicalOperationAtom = atomWithReset<HistoricalOperationData[] | null>(null)
export const historicalClaimHZNAndZUSDAtom = atomWithReset<HistoricalClaimHZNAndZusdData[]>([])
