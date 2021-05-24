import { constants } from "ethers";
import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";
import { formatRatioToPercent } from "@utils/formatters";

export const readyAtom = atomWithReset(false);

export const totalSupplyAtom = atomWithReset(constants.Zero);
export const targetCRatioAtom = atomWithReset(constants.Zero);
export const liquidationRatioAtom = atomWithReset(constants.Zero);
export const liquidationDelayAtom = atomWithReset(constants.Zero);

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
