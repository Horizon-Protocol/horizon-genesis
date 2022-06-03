import type { Holder } from "@horizon-protocol/data";
import { atom } from "jotai";
import { WEEKS_IN_YEAR } from "@utils/date";
import {
  lastDebtLedgerEntryAtom,
  targetRatioAtom,
  totalIssuedZUSDExclEthAtom,
} from "./app";
import { hznRateAtom, zUSDRateAtom } from "./exchangeRates";
import { previousFeePeriodAtom } from "./feePool";

export const top1000HoldersAtom = atom<Holder[]>([]);

export const activeRatioAtom = atom((get) => {
  const targetCRatioBN = get(targetRatioAtom);
  const lastDebtLedgerEntryBN = get(lastDebtLedgerEntryAtom);
  const totalIssuedSynthsBN = get(totalIssuedZUSDExclEthAtom);

  const targetCRatio = targetCRatioBN.toNumber();
  const lastDebtLedgerEntry = lastDebtLedgerEntryBN.toNumber();
  const totalIssuedSynths = totalIssuedSynthsBN.toNumber();

  const hznRate = get(hznRateAtom);
  const hznPrice = hznRate.toNumber();

  const holders = get(top1000HoldersAtom);

  if (!(totalIssuedSynths && hznPrice && targetCRatio && lastDebtLedgerEntry)) {
    return 0;
  }
  let stakersTotalDebt = 0;
  let stakersTotalCollateral = 0;

  // if (import.meta.env.DEV) {
  //   console.log("===zAssets", {
  //     holders,
  //     hznPrice,
  //     targetCRatio,
  //     lastDebtLedgerEntry,
  //     totalIssuedSynths,
  //   });
  //   // console.log(JSON.stringify(holders));
  // }

  for (const {
    collateral,
    debtEntryAtIndex,
    initialDebtOwnership,
  } of holders || []) {
    if (!collateral || !debtEntryAtIndex || !initialDebtOwnership) continue;

    let debtBalance =
      ((totalIssuedSynths * lastDebtLedgerEntry) / debtEntryAtIndex) *
      initialDebtOwnership;

    if (isNaN(debtBalance)) {
      debtBalance = 0;
    }

    if (Number(debtBalance) > 0) {
      stakersTotalDebt += Number(debtBalance);
      stakersTotalCollateral += Number(collateral * hznPrice);
    }
  }

  if (import.meta.env.DEV) {
    // console.log({
    //   stakersTotalDebt,
    //   stakersTotalCollateral,
    // });
  }

  return stakersTotalDebt ? stakersTotalCollateral / stakersTotalDebt : null;
});

// est. APR
export const estimateAprAtom = atom((get) => {
  const issuedZUSDExclEthBN = get(totalIssuedZUSDExclEthAtom);
  const hznPriceBN = get(hznRateAtom);
  const zUSDPriceBN = get(zUSDRateAtom);

  const issuedZUSDExclEth = issuedZUSDExclEthBN.toNumber();
  const hznPrice = hznPriceBN.toNumber();
  const zUSDPrice = zUSDPriceBN.toNumber();

  const { feesToDistribute: fees, rewardsToDistribute: rewards } = get(
    previousFeePeriodAtom
  );

  const activeRatio = get(activeRatioAtom);

  // if (import.meta.env.DEV) {
  //   console.log("===apr:", {
  //     issuedZUSDExclEth,
  //     zUSDPrice,
  //     hznPrice,
  //     fees,
  //     rewards,
  //     activeRatio,
  //   });
  // }

  return activeRatio
    ? ((zUSDPrice * fees + hznPrice * rewards) * WEEKS_IN_YEAR) /
        (issuedZUSDExclEth * activeRatio)
    : 0;
});
