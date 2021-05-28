import { Rates, CryptoCurrency } from "@utils/currencies";
import { toBigNumber } from "@utils/number";
import { atom } from "jotai";
import { selectAtom } from "jotai/utils";

export const ratesAtom = atom<Rates>({});

export const hznRateAtom = selectAtom(
  ratesAtom,
  (rates) => rates[CryptoCurrency.HZN] || 0
);

export const hznRateBNAtom = selectAtom(ratesAtom, (rates) =>
  toBigNumber(rates[CryptoCurrency.HZN] || 0)
);
