import { NumericValue, toBN, zeroBN, maxBN } from "@utils/number";
import { isString } from "lodash";
import { ChainExplorerUrl } from "@utils/constants";

/**
 * to mint zUSD amount
 *
 * @export
 * @param {BN} targetRatio
 * @param {NumericValue} stakeAmount
 * @param {BN} hznRate
 * @return {*}  {BN}
 */
export function getMintAmount(
  targetRatio: BN,
  stakeAmount: NumericValue,
  hznRate: BN
): BN {
  if (!stakeAmount || !targetRatio || !hznRate) return toBN(0);
  return toBN(stakeAmount).multipliedBy(hznRate).multipliedBy(targetRatio);
}

/**
 * to mint HZN amount
 *
 * @export
 * @param {BN} targetRatio
 * @param {NumericValue} mintAmount
 * @param {BN} hznRate
 * @return {*}  {BN}
 */
export function getStakingAmount(
  targetRatio: BN,
  mintAmount: NumericValue,
  hznRate: BN
): BN {
  if (!mintAmount || !targetRatio || !hznRate) return toBN(0);
  return toBN(mintAmount).dividedBy(hznRate).dividedBy(targetRatio);
}

export function getTransferableAmountFromMint(
  balance: BN,
  stakedAmount: BN,
  totalEscrowBalance: BN
): BN {
  if (!balance || !stakedAmount) return toBN(0);
  return maxBN(balance.minus(stakedAmount).minus(totalEscrowBalance), zeroBN);
}

export function getTransferableAmountFromBurn(
  amountToBurn: NumericValue,
  debtEscrowBalance: BN,
  targetRatio: BN,
  hznRate: BN,
  transferable: BN
): BN {
  if (!amountToBurn) return toBN(0);
  return transferable.plus(
    maxBN(
      toBN(amountToBurn)
        .minus(debtEscrowBalance)
        .dividedBy(targetRatio)
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

export function waitForGlobal(
  key: string,
  callback: () => void,
  maxWait: number = 10000,
  waited: number = 0
) {
  if (Reflect.has(window, key)) {
    callback();
  } else {
    if (waited > maxWait) {
      return;
    }
    console.log("wait", key);
    setTimeout(function () {
      waitForGlobal(key, callback, maxWait, waited + 100);
    }, 100);
  }
}

export function getWalletErrorMsg(e: any, defaultMsg = "Operation Failed") {
  // Binance Wallet
  if (isString(e?.error)) {
    return e.error;
  }

  // Metamask like Wallet
  if (isString(e?.message)) {
    return e.message;
  }

  return defaultMsg;
}

export const BlockExplorer = {
  baseLink: ChainExplorerUrl,
  txLink: (txId: string) => `${ChainExplorerUrl}tx/${txId}`,
  addressLink: (address: string) => `${ChainExplorerUrl}address/${address}`,
  tokenLink: (address: string) => `${ChainExplorerUrl}token/${address}`,
  blockLink: (blockNumber: string) => `${ChainExplorerUrl}block/${blockNumber}`,
};
