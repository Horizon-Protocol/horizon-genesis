import { BLOCKS_PER_YEAR, BSC_BLOCK_TIME } from "@utils/constants";

/**
 * Get the APY value in %
 * @param stakingTokenPrice Token price in the same quote currency
 * @param rewardTokenPrice Token price in the same quote currency
 * @param totalStaked Total amount of stakingToken in the pool
 * @param rewardsPerBlock Amount of token rewards for each new block
 * @returns Null if the APY is NaN or infinite.
 */
export const getApy = (
  stakingTokenPrice: number,
  rewardTokenPrice: number,
  totalStaked: number,
  rewardsPerSecond: number
): number => {
  const totalRewardPricePerYear =
    rewardsPerSecond * BSC_BLOCK_TIME * BLOCKS_PER_YEAR * rewardTokenPrice;

  const totalStakingTokenInPool = totalStaked * stakingTokenPrice;

  if (!totalStakingTokenInPool) {
    return 0;
  }
  const apyPercent = (100 * totalRewardPricePerYear) / totalStakingTokenInPool;
  // console.log("apy:", apy.toString(), formatBalance(apy));

  return apyPercent;
};
