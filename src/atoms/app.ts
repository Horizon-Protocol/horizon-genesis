import { atom } from "jotai";
import { atomWithReset, selectAtom } from "jotai/utils";
import { zeroBN, toBigNumber, cRatioToPercent } from "@utils/number";

// app state
export const readyAtom = atom(false);

// static variables from contract
export const totalSupplyAtom = atomWithReset(zeroBN);
export const totalIssuedZUSDExclEthAtom = atomWithReset(zeroBN); // total zUSD in pool
export const targetCRatioAtom = atomWithReset(zeroBN);
export const liquidationRatioAtom = atomWithReset(zeroBN);
export const liquidationDelayAtom = atomWithReset(zeroBN);

// HZN price
export const hznPriceAtom = atomWithReset(0);

export const ratiosPercentAtom = atom((get) => {
  const targetCRatio = get(targetCRatioAtom);
  const liquidationRatio = get(liquidationRatioAtom);

  return {
    targetCRatio,
    targetCRatioPercent: cRatioToPercent(targetCRatio),
    liquidationRatioPercent: cRatioToPercent(liquidationRatio),
  };
});

export const presetCRatioPercentsAtom = selectAtom(
  ratiosPercentAtom,
  ({ targetCRatio, targetCRatioPercent }) => {
    return [
      {
        title: "CONSERVATIVE",
        percent: targetCRatioPercent + 400,
        cRatio: toBigNumber(100).div(toBigNumber(targetCRatioPercent + 400)),
      },
      {
        title: "NEUTRAL",
        percent: targetCRatioPercent + 200,
        cRatio: toBigNumber(100).div(toBigNumber(targetCRatioPercent + 200)),
      },
      {
        title: "AGGRESSIVE",
        percent: targetCRatioPercent,
        cRatio: targetCRatio,
      },
    ];
  }
);
