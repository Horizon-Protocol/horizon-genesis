import { BigNumber, constants, utils } from "ethers";
import { atom } from "jotai";
import { atomWithReset, selectAtom } from "jotai/utils";
import { formatBalance, formatRatioToPercent } from "@utils/formatters";
import { SynthBalancesMap } from "@utils/currencies";
import { hznRateAtom } from "./exchangeRates";
import { targetCRatioAtom } from "./app";

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

export const hznStakedAtom = atom((get) => {
  const { currentCRatio, collateral } = get(debtAtom);
  const targetCRatio = get(targetCRatioAtom);
  const hznRate = get(hznRateAtom);
  if (hznRate <= 0 || targetCRatio.lte(0)) {
    return constants.Zero;
  }

  const hznRateBN = utils.parseEther("2.33");

  console.log("currentCRatio", utils.formatEther(currentCRatio));
  console.log("targetCRatio", utils.formatEther(targetCRatio));
  console.log("ratio", utils.formatEther(currentCRatio.div(targetCRatio)));
  console.log("ratio", currentCRatio.div(targetCRatio).toString());
  const stakedCollateral = collateral.mul(
    Math.min(1, currentCRatio.div(targetCRatio).toNumber())
  );

  const stakedCollateralValue = stakedCollateral.mul(hznRateBN);

  console.log("collateral", utils.formatEther(collateral));
  console.log("stakedCollateral", utils.formatEther(stakedCollateral));
  console.log("hznRate", hznRate);
  console.log("stakedCollateralValue", stakedCollateralValue.toString());

  console.log("fuck", utils.formatEther(stakedCollateralValue));
  return stakedCollateralValue;
});

// zAssets
export const zAssetstotalUSDAtom = atom<BigNumber>(constants.Zero);

export const zAssetsBalanceAtom = atom<SynthBalancesMap>({});

export const zUSDBalanceAtom = selectAtom(
  zAssetsBalanceAtom,
  (rates) => rates["zUSD"]?.balance || constants.Zero
);
