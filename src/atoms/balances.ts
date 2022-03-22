import { atomWithReset } from "jotai/utils";
import { SynthBalancesMap } from "@utils/currencies";
import { atom } from "jotai";
import { zeroBN } from "@utils/number";

declare global {
    interface ZAssetsBalanceInfo extends Partial<Synth> {
        color?: string;
        amountUSD?: number;
        amount?: number;
        percent?: number;
        id?: string;
    }
  }

export type ZAssetsBalance = Partial<SynthBalancesMap>;

// zAssets balance
export const zAssetsBalanceAtom = atomWithReset<ZAssetsBalance>({});

//zUSD
export const zUSDBalanceAtom = atomWithReset(zeroBN);

//zAssets balance and extra info
export const zAssetsBalanceInfoAtom = atomWithReset<ZAssetsBalanceInfo[]>([]);