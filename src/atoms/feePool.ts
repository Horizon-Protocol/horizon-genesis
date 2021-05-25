import { atom } from "jotai";
import { selectAtom } from "jotai/utils";
import { toBigNumber } from "@utils/number";

interface FeePoolAtom {
  feePeriodDuration: number;
  startTime: number;
  feesToDistribute: number;
  feesClaimed: number;
  rewardsToDistribute: number;
  rewardsToDistributeBN: BN;
  rewardsClaimed: number;
}

export const feePoolAtom = atom<FeePoolAtom>({
  feePeriodDuration: 0,
  startTime: 0,
  feesToDistribute: 0,
  feesClaimed: 0,
  rewardsToDistribute: 0,
  rewardsToDistributeBN: toBigNumber(0),
  rewardsClaimed: 0,
});
