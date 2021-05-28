import { atom } from "jotai";
import { atomWithReset, selectAtom } from "jotai/utils";
import {
  zeroBN,
  cRatioToPercent,
  maxBN,
  minBN,
  toBigNumber,
} from "@utils/number";
import { SynthBalancesMap } from "@utils/currencies";
import { targetCRatioAtom } from "./app";

export const debtAtom = atomWithReset({
  balance: zeroBN,
  currentCRatio: zeroBN,
  transferable: zeroBN,
  debtBalance: zeroBN,
  collateral: zeroBN, // all total HZN amount
  issuableSynths: zeroBN,
  escrowedReward: zeroBN,
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

// HZN amount in different status
export const collateralDataAtom = atom((get) => {
  const targetCRatio = get(targetCRatioAtom);
  const { collateral, currentCRatio, transferable } = get(debtAtom);

  const stakedCollateral = collateral.multipliedBy(
    minBN(toBigNumber(1), currentCRatio.dividedBy(targetCRatio))
  );
  const lockedCollateral = collateral.minus(transferable);
  const unstakedCollateral = collateral.minus(stakedCollateral);

  console.log({
    stakedCollateral: stakedCollateral.toNumber(),
    unstakedCollateral: unstakedCollateral.toNumber(),
    lockedCollateral: lockedCollateral.toNumber(),
  });

  return {
    stakedCollateral,
    unstakedCollateral,
    lockedCollateral,
  };
});

export const burnAmountToFixCRatioAtom = atom((get) => {
  const { debtBalance, issuableSynths } = get(debtAtom);
  return maxBN(debtBalance.minus(issuableSynths), zeroBN);
});

// zAssets
export const zAssetstotalUSDAtom = atom(zeroBN);

export const zAssetsBalanceAtom = atom<SynthBalancesMap>({});

export const zUSDBalanceAtom = selectAtom(
  zAssetsBalanceAtom,
  (rates) => rates["zUSD"]?.balance || zeroBN
);
