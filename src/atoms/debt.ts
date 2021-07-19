import { atom } from "jotai";
import { atomWithReset, selectAtom, RESET } from "jotai/utils";
import { zeroBN, cRatioToPercent, maxBN, minBN, toBN } from "@utils/number";
import { SynthBalancesMap } from "@utils/currencies";
import { targetRatioAtom } from "./app";

export const debtAtom = atomWithReset({
  balance: zeroBN,
  currentCRatio: zeroBN,
  transferable: zeroBN,
  debtBalance: zeroBN,
  collateral: zeroBN, // all total HZN amount
  issuableSynths: zeroBN,
  escrowedReward: zeroBN,
  liquidationDeadline: 0, // deadline timestamp(seconds) for liquidation
});

export const currentCRatioPercentAtom = atom((get) => {
  const currentCRatio = get(debtAtom).currentCRatio;
  // const targetRatio = get(targetRatioAtom);

  // const percentCurrentCRatioOfTarget = currentCRatio.isZero()
  //   ? toBN(0)
  //   : toBN(100).multipliedBy(targetRatio).div(currentCRatio);

  // return percentCurrentCRatioOfTarget.isNaN()
  //   ? 0
  //   : percentCurrentCRatioOfTarget.toNumber();
  return cRatioToPercent(currentCRatio);
});

// HZN amount in different status
export const collateralDataAtom = atom((get) => {
  const targetRatio = get(targetRatioAtom);
  const { collateral, currentCRatio, transferable } = get(debtAtom);

  const stakedCollateral = targetRatio.isZero()
    ? zeroBN
    : collateral.multipliedBy(
        minBN(toBN(1), currentCRatio.dividedBy(targetRatio))
      );
  const lockedCollateral = collateral.minus(transferable);
  const unstakedCollateral = collateral.minus(stakedCollateral);

  // console.log({
  //   stakedCollateral: stakedCollateral.toNumber(),
  //   unstakedCollateral: unstakedCollateral.toNumber(),
  //   lockedCollateral: lockedCollateral.toNumber(),
  // });

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
export const zAssetstotalUSDAtom = atomWithReset(zeroBN);

export const zAssetsBalanceAtom = atomWithReset<SynthBalancesMap>({});

export const zUSDBalanceAtom = selectAtom(
  zAssetsBalanceAtom,
  (rates) => rates["zUSD"]?.balance || zeroBN
);

// reset all debt balances
export const resetDebtAtom = atom(null, (get, set) => {
  set(debtAtom, RESET);
});

export const resetZAssetsAtom = atom(null, (get, set) => {
  set(zAssetstotalUSDAtom, RESET);
  set(zAssetsBalanceAtom, RESET);
});
