import { NumericValue, toBN, zeroBN, maxBN } from "@utils/number";

/**
 * to mint zUSD amount
 *
 * @export
 * @param {BN} targetCRatio
 * @param {NumericValue} stakeAmount
 * @param {BN} hznRate
 * @return {*}  {BN}
 */
export function getMintAmount(
  targetCRatio: BN,
  stakeAmount: NumericValue,
  hznRate: BN
): BN {
  if (!stakeAmount || !targetCRatio || !hznRate) return toBN(0);
  return toBN(stakeAmount).multipliedBy(hznRate).multipliedBy(targetCRatio);
}

/**
 * to mint HZN amount
 *
 * @export
 * @param {BN} targetCRatio
 * @param {NumericValue} mintAmount
 * @param {BN} hznRate
 * @return {*}  {BN}
 */
export function getStakingAmount(
  targetCRatio: BN,
  mintAmount: NumericValue,
  hznRate: BN
): BN {
  if (!mintAmount || !targetCRatio || !hznRate) return toBN(0);
  return toBN(mintAmount).dividedBy(hznRate).dividedBy(targetCRatio);
}

export function getTransferableAmountFromMint(
  balance: BN,
  stakedAmount: BN
): BN {
  if (!balance || !stakedAmount) return toBN(0);
  return maxBN(balance.minus(stakedAmount), zeroBN);
}

export function getTransferableAmountFromBurn(
  amountToBurn: NumericValue,
  debtEscrowBalance: BN,
  targetCRatio: BN,
  hznRate: BN,
  transferable: BN
): BN {
  if (!amountToBurn) return toBN(0);
  return transferable.plus(
    maxBN(
      toBN(amountToBurn)
        .minus(debtEscrowBalance)
        .dividedBy(targetCRatio)
        .dividedBy(hznRate),
      zeroBN
    )
  );
}

export function sanitiseValue(value: BN) {
  if (value.isNegative() || value.isNaN() || !value.isFinite()) {
    return zeroBN;
  } else {
    return value;
  }
}
