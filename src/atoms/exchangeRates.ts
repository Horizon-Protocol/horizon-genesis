import { Rates } from "@utils/currencies";
import { toBigNumber } from "@utils/number";
import { atom } from "jotai";
import { selectAtom } from "jotai/utils";

export const ratesAtom = atom<Rates>({});

export const hznRateAtom = selectAtom(ratesAtom, (rates) =>
  toBigNumber(rates.HZN || 0)
);

export const zUSDRateAtom = selectAtom(ratesAtom, (rates) =>
  toBigNumber(rates.zUSD || 0)
);
