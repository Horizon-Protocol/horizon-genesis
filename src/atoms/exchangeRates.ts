import { Rates } from "@utils/currencies";
import { toBN } from "@utils/number";
import { atom } from "jotai";
import { selectAtom } from "jotai/utils";

export const ratesAtom = atom<Rates>({});

export const hznRateAtom = selectAtom(ratesAtom, (rates) =>
  toBN(rates.HZN || 0)
);

export const zUSDRateAtom = selectAtom(ratesAtom, (rates) =>
  toBN(rates.zUSD || 0)
);
