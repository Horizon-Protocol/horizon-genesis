import { BigNumber, utils } from "ethers";
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
  totalStaked: BigNumber,
  rewardsPerBlock: BigNumber
): number => {
  // console.log({
  //   stakingTokenPrice,
  //   rewardTokenPrice,
  //   totalStaked: utils.formatEther(totalStaked),
  //   rewardsPerBlock: utils.formatEther(rewardsPerBlock),
  // });
  const totalRewardPricePerYear = utils
    .parseEther(rewardTokenPrice.toString())
    .mul(rewardsPerBlock)
    .mul(BLOCKS_PER_YEAR);

  const totalStakingTokenInPool = utils
    .parseEther(stakingTokenPrice.toString())
    .mul(totalStaked);

  if (totalStakingTokenInPool.eq(0)) {
    return 0;
  }
  const apy = totalRewardPricePerYear.mul(10000).div(totalStakingTokenInPool);
  // console.log("apy:", apy.toString(), getFullDisplayBalance(apy));

  return apy.toNumber() / 100;
};
