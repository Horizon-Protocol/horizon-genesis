import { Rates } from "@utils/currencies";
import { atom } from "jotai";

export const ratesAtom = atom<Partial<Rates>>({});
