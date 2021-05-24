import { constants } from "ethers";
import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";
import { formatRatioToPercent } from "@utils/formatters";

export const debtAtom = atomWithReset({
  currentCRatio: constants.Zero,
  transferable: constants.Zero,
  debtBalance: constants.Zero,
  collateral: constants.Zero,
  issuableSynths: constants.Zero,
  balance: constants.Zero,
});

export const currentCRatioPercentAtom = atom((get) =>
  formatRatioToPercent(get(debtAtom).currentCRatio)
);
