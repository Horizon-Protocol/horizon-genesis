import { BLOCKS_PER_YEAR } from "@utils/constants";

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
  totalStaked: BN,
  rewardsPerBlock: BN
): number => {
  // console.log({
  //   stakingTokenPrice,
  //   rewardTokenPrice,
  //   totalStaked: utils.formatEther(totalStaked),
  //   rewardsPerBlock: utils.formatEther(rewardsPerBlock),
  // });
  const totalRewardPricePerYear = rewardsPerBlock
    .multipliedBy(BLOCKS_PER_YEAR)
    .multipliedBy(rewardTokenPrice);

  const totalStakingTokenInPool = totalStaked.multipliedBy(stakingTokenPrice);

  if (totalStakingTokenInPool.eq(0)) {
    return 0;
  }
  const apyPercent = totalRewardPricePerYear
    .div(totalStakingTokenInPool)
    .multipliedBy(100);
  // console.log("apy:", apy.toString(), formatBalance(apy));

  return apyPercent.toNumber();
};
