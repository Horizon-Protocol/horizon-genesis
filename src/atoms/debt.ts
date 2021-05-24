import { constants, utils } from "ethers";
import { atom } from "jotai";
import { atomWithReset, selectAtom } from "jotai/utils";
import BigNumber from "bignumber.js";
import { zeroBN } from "@utils/number";
import { formatRatioToPercent } from "@utils/formatters";
import { SynthBalancesMap } from "@utils/currencies";
import { hznRateAtom } from "./exchangeRates";
import { targetCRatioAtom } from "./app";

export const debtAtom = atomWithReset({
  currentCRatio: zeroBN,
  transferable: zeroBN,
  debtBalance: zeroBN,
  collateral: zeroBN,
  issuableSynths: zeroBN,
  balance: zeroBN,
});

export const currentCRatioPercentAtom = atom((get) =>
  formatRatioToPercent(get(debtAtom).currentCRatio)
);

export const hznStakedAtom = atom((get) => {
  const { currentCRatio, collateral } = get(debtAtom);
  const targetCRatio = get(targetCRatioAtom);
  const hznRate = get(hznRateAtom);
  if (hznRate <= 0 || targetCRatio.lte(0)) {
    return constants.Zero;
  }

  const hznRateBN = utils.parseEther("2.33");

  console.log("currentCRatio", currentCRatio);
  console.log("targetCRatio", targetCRatio);
  console.log("ratio", currentCRatio.div(targetCRatio));
  console.log("ratio", currentCRatio.div(targetCRatio).toString());
  const stakedCollateral = collateral.multipliedBy(
    Math.min(1, currentCRatio.div(targetCRatio).toNumber())
  );

  const stakedCollateralValue = stakedCollateral.multipliedBy(hznRateBN);

  console.log("collateral", collateral);
  console.log("stakedCollateral", stakedCollateral);
  console.log("hznRate", hznRate);
  console.log("stakedCollateralValue", stakedCollateralValue.toString());

  console.log("res", stakedCollateralValue);
  return stakedCollateralValue;
});

// zAssets
export const zAssetstotalUSDAtom = atom<BigNumber>(zeroBN);

export const zAssetsBalanceAtom = atom<SynthBalancesMap>({});

export const zUSDBalanceAtom = selectAtom(
  zAssetsBalanceAtom,
  (rates) => rates["zUSD"]?.balance || constants.Zero
);
