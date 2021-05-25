import { atom } from "jotai";
import { atomWithReset, selectAtom } from "jotai/utils";
import { zeroBN, cRatioToPercent } from "@utils/number";
import { SynthBalancesMap } from "@utils/currencies";
// import { hznRateAtom } from "./exchangeRates";
import { targetCRatioAtom } from "./app";

export const debtAtom = atomWithReset({
  balance: zeroBN,
  currentCRatio: zeroBN,
  transferable: zeroBN,
  debtBalance: zeroBN,
  collateral: zeroBN,
  issuableSynths: zeroBN,
});

export const currentCRatioPercentAtom = atom((get) => {
  const currentCRatio = get(debtAtom).currentCRatio;
  // const targetCRatio = get(targetCRatioAtom);

  // const percentCurrentCRatioOfTarget = currentCRatio.isZero()
  //   ? toBigNumber(0)
  //   : toBigNumber(100).multipliedBy(targetCRatio).div(currentCRatio);

  // return percentCurrentCRatioOfTarget.isNaN()
  //   ? 0
  //   : percentCurrentCRatioOfTarget.toNumber();
  return cRatioToPercent(currentCRatio);
});

export const hznStakedAtom = atom((get) => {
  const { currentCRatio, collateral } = get(debtAtom);
  const targetCRatio = get(targetCRatioAtom);
  if (targetCRatio.lte(0)) {
    return zeroBN;
  }

  const stakedCollateral = collateral.multipliedBy(
    Math.min(1, currentCRatio.div(targetCRatio).toNumber())
  );

  return stakedCollateral;
});

// zAssets
export const zAssetstotalUSDAtom = atom(zeroBN);

export const zAssetsBalanceAtom = atom<SynthBalancesMap>({});

export const zUSDBalanceAtom = selectAtom(
  zAssetsBalanceAtom,
  (rates) => rates["zUSD"]?.balance || zeroBN
);
