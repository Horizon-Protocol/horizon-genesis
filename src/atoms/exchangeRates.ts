import { Rates, CryptoCurrency } from "@utils/currencies";
import { atom } from "jotai";
import { selectAtom } from "jotai/utils";

export const ratesAtom = atom<Rates>({});

export const hznRateAtom = selectAtom(
  ratesAtom,
  (rates) => rates[CryptoCurrency.HZN]
);
