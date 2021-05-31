import { atom } from "jotai";
import { atomWithReset, RESET } from "jotai/utils";
import { zeroBN } from "@utils/number";

interface FeePoolAtom {
  feePeriodDuration: number;
  startTime: number;
  feesToDistribute: number;
  feesClaimed: number;
  rewardsToDistribute: number;
  rewardsToDistributeBN: BN;
  rewardsClaimed: number;
}

export const currentFeePeriodAtom = atom<FeePoolAtom>({
  feePeriodDuration: 0,
  startTime: 0,
  feesToDistribute: 0,
  feesClaimed: 0,
  rewardsToDistribute: 0,
  rewardsToDistributeBN: zeroBN,
  rewardsClaimed: 0,
});

export const previoudFeePeriodAtom = atom<FeePoolAtom>({
  feePeriodDuration: 0,
  startTime: 0,
  feesToDistribute: 0,
  feesClaimed: 0,
  rewardsToDistribute: 0,
  rewardsToDistributeBN: zeroBN,
  rewardsClaimed: 0,
});

export const feePeriodDatesAtom = atom((get) => {
  const { startTime, feePeriodDuration } = get(currentFeePeriodAtom);
  return {
    currentFeePeriodStarts: startTime ? new Date(startTime * 1000) : undefined,
    nextFeePeriodStarts: startTime
      ? new Date((startTime + feePeriodDuration) * 1000)
      : undefined,
  };
});

// user rewards
export const rewardsAtom = atomWithReset({
  claimable: false,
  stakingReward: zeroBN,
  exchangeReward: zeroBN,
});

// reset user rewards
export const resetAtom = atom(null, (get, set) => {
  set(rewardsAtom, RESET);
});
