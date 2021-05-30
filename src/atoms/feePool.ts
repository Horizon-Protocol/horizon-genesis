import { atom } from "jotai";
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

export const feePoolAtom = atom<FeePoolAtom>({
  feePeriodDuration: 0,
  startTime: 0,
  feesToDistribute: 0,
  feesClaimed: 0,
  rewardsToDistribute: 0,
  rewardsToDistributeBN: zeroBN,
  rewardsClaimed: 0,
});

export const rewardsAtom = atom({
  claimable: false,
  stakingReward: zeroBN,
  exchangeReward: zeroBN,
});

export const nextFeePeriodStartAtom = atom((get) => {
  const { startTime, feePeriodDuration } = get(feePoolAtom);
  console.log({
    startTime,
    feePeriodDuration,
  });
  return new Date(startTime ? (startTime + feePeriodDuration) * 1000 : 0);
});
