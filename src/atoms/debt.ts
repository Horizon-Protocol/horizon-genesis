import { constants } from "ethers";
import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";
import { formatRatioToPercent } from "@utils/formatters";

export const debtAtom = atomWithReset({
  targetCRatio: constants.Zero,
  currentCRatio: constants.Zero,
  liquidationRatio: constants.Zero,
  transferable: constants.Zero,
  debtBalance: constants.Zero,
  collateral: constants.Zero,
  issuableSynths: constants.Zero,
  balance: constants.Zero,
  totalSupply: constants.Zero,
});

export const ratiosPercentAtom = atom((get) => {
  const { targetCRatio, currentCRatio, liquidationRatio } = get(debtAtom);

  return {
    currentCRatio: formatRatioToPercent(currentCRatio),
    targetCRatio: formatRatioToPercent(targetCRatio),
    liquidationRatio: formatRatioToPercent(liquidationRatio),
  };
});
