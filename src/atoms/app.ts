import { atom } from "jotai";
import { atomWithReset, selectAtom } from "jotai/utils";
import { zeroBN, toBN, cRatioToPercent } from "@utils/number";

// app state
export const readyAtom = atom(false);

// static app variables loaded
export const appDataReadyAtom = atom(false);

// static variables from contract
export const totalSupplyAtom = atomWithReset(zeroBN);
export const totalIssuedZUSDExclEthAtom = atomWithReset(zeroBN); // total zUSD in pool
export const targetRatioAtom = atomWithReset(zeroBN);
export const liquidationRatioAtom = atomWithReset(zeroBN);
export const liquidationDelayAtom = atomWithReset(zeroBN);

export const ratiosPercentAtom = atom((get) => {
  const targetRatio = get(targetRatioAtom);
  const liquidationRatio = get(liquidationRatioAtom);

  return {
    targetRatio,
    targetCRatioPercent: cRatioToPercent(targetRatio),
    liquidationRatioPercent: cRatioToPercent(liquidationRatio),
  };
});

export const presetCRatioPercentsAtom = selectAtom(
  ratiosPercentAtom,
  ({ targetRatio, targetCRatioPercent }) => {
    return [
      {
        title: "CONSERVATIVE",
        percent: targetCRatioPercent + 400,
        cRatio: toBN(100).div(toBN(targetCRatioPercent + 400)),
      },
      {
        title: "NEUTRAL",
        percent: targetCRatioPercent + 200,
        cRatio: toBN(100).div(toBN(targetCRatioPercent + 200)),
      },
      {
        title: "AGGRESSIVE",
        percent: targetCRatioPercent,
        cRatio: targetRatio,
      },
    ];
  }
);
