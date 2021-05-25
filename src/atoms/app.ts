import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";
import { zeroBN, toBigNumber } from "@utils/number";

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
  const percentageTargetCRatio = targetCRatio.isZero()
    ? toBigNumber(0)
    : toBigNumber(100).div(targetCRatio);
  const percentageLiquidationRatio = liquidationRatio.isZero()
    ? toBigNumber(0)
    : toBigNumber(100).div(liquidationRatio);

  return {
    targetCRatioPercent: percentageTargetCRatio.isNaN()
      ? 0
      : percentageTargetCRatio.toNumber(),
    liquidationRatioPercent: percentageLiquidationRatio.isNaN()
      ? 0
      : percentageLiquidationRatio.toNumber(),
  };
});
