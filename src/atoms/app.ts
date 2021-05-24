import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";
import BigNumber from "bignumber.js";
import { zeroBN } from "@utils/number";
import { formatRatioToPercent } from "@utils/formatters";

export const readyAtom = atomWithReset(false);

export const totalSupplyAtom = atomWithReset(zeroBN);
export const targetCRatioAtom = atomWithReset(zeroBN);
export const liquidationRatioAtom = atomWithReset(zeroBN);
export const liquidationDelayAtom = atomWithReset(zeroBN);

// HZN price
export const hznPriceAtom = atomWithReset(0);

export const ratiosPercentAtom = atom((get) => {
  const targetCRatio = get(targetCRatioAtom);
  const liquidationRatio = get(liquidationRatioAtom);

  return {
    targetCRatio: formatRatioToPercent(targetCRatio),
    liquidationRatio: formatRatioToPercent(liquidationRatio),
  };
});
