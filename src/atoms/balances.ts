import { atomWithReset } from "jotai/utils";
import { SynthBalancesMap } from "@utils/currencies";
import { atom } from "jotai";
import { zeroBN } from "@utils/number";

export type ZAssetsBalance = Partial<SynthBalancesMap>;

// zAssets
export const zAssetsBalanceAtom = atomWithReset<ZAssetsBalance>({});

//zUSD
export const zUSDBalanceAtom = atomWithReset(zeroBN);
