import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const openAtom = atom(false);
export const openLinkDropDownAtom = atom(false);
export const helpDropDownAtom = atom(false);
export const detailAtom = atom<WalletDetail | null>(null);
export const prevWalletNameAtom = atomWithStorage<string>(
  "horizon-genesis-wallet-name",
  ""
);
