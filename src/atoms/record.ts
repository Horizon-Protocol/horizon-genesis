import { atom } from "jotai";
import { atomWithReset, atomWithStorage } from "jotai/utils";

export enum HistoryType{
    All = "All Types",
    Mint = 'Mint',
    Burn = 'Burn',
    Claim = 'Claim'
}

export interface HistoryDateRange{
    start: string;
    end: string;
}

export const HistoryTypeAtom = atomWithReset<HistoryType>(HistoryType.All);
export const HistoryDateRange = atomWithReset<HistoryDateRange>({start:'',end:''});


