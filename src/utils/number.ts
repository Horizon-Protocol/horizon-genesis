import bignumber from "bignumber.js";
import { BigNumber, ethers, utils } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import numbro from "numbro";
import { isFiatCurrency } from "./currencies";

declare global {
  type BN = bignumber;
}

// ui defaults
export const DEFAULT_SEARCH_DEBOUNCE_MS = 300;
export const DEFAULT_REQUEST_REFRESH_INTERVAL = 30000; // 30s
export const DEFAULT_CRYPTO_DECIMALS = 4;
export const DEFAULT_FIAT_DECIMALS = 2;
export const DEFAULT_NUMBER_DECIMALS = 2;
export const DEFAULT_PERCENT_DECIMALS = 2;

export type NumericValue = BN | string | number;

export type FormatNumberOptions = {
  prefix?: string;
  suffix?: string;
  mantissa?: number;
};

export type FormatCurrencyOptions = numbro.Format & {
  sign?: string;
  currencyKey?: CurrencyKey;
};

const DEFAULT_CURRENCY_DECIMALS = 2;
export const SHORT_CRYPTO_CURRENCY_DECIMALS = 4;
export const LONG_CRYPTO_CURRENCY_DECIMALS = 8;

export const getDecimalPlaces = (value: NumericValue) =>
  (value.toString().split(".")[1] || "").length;

export const toBN = (value: NumericValue) =>
  bignumber.isBigNumber(value) ? value : new bignumber(value);

export const etherToBN = (value: ethers.BigNumber) =>
  toBN(utils.formatEther(value));

export function BNToEther(value: BN): ethers.BigNumber {
  return utils.parseUnits(value.toString());
}

export const zeroBN = toBN(0);

export const maxBN = bignumber.maximum;

export const minBN = bignumber.minimum;

export const formatNumber = (
  value: NumericValue,
  options: FormatNumberOptions = {}
) => {
  const { prefix, suffix, ...format } = options;

  const formattedValue: any[] = [];
  if (prefix) {
    formattedValue.push(prefix);
  }

  formattedValue.push(numbro(toBN(value)).format({ ...format }));

  if (suffix) {
    formattedValue.push(` ${suffix}`);
  }

  return formattedValue.join("");
};

export const formatCryptoCurrency = (
  value: NumericValue,
  { sign: prefix, currencyKey: suffix, ...format }: FormatCurrencyOptions = {}
) =>
  formatNumber(value, {
    prefix,
    suffix,
    mantissa: value < 100 ? DEFAULT_CRYPTO_DECIMALS : DEFAULT_NUMBER_DECIMALS,
    ...format,
  });

export const formatFiatCurrency = (
  value: NumericValue,
  { sign: prefix, currencyKey: suffix, ...format }: FormatCurrencyOptions = {}
) =>
  formatNumber(value, {
    prefix,
    suffix,
    mantissa: DEFAULT_FIAT_DECIMALS,
    ...format,
  });

export const formatCurrency = (
  currencyKey: string,
  value: NumericValue,
  options?: FormatCurrencyOptions
) =>
  isFiatCurrency(currencyKey as CurrencyKey)
    ? formatFiatCurrency(value, options)
    : formatCryptoCurrency(value, options);

export const formatPercent = (
  value: NumericValue,
  options?: { minDecimals: number }
) => {
  return formatNumber(Number(value) * 100);
};

export const formatUnitsWithDecimals = (
  value: BN | undefined,
  decimal = 1e18
) => {
  if (!value) {
    value = zeroBN;
  }
  return Number(value) / decimal;
};

export const formatBNWithDecimals = (value: BN | undefined, decimal = 1e18) => {
  if (!value) {
    value = zeroBN;
  }
  return toBN(Number(value) / decimal);
};

// TODO: figure out a robust way to get the correct precision.
const getPrecision = (amount: NumericValue) => {
  if (amount >= 1) {
    return DEFAULT_CURRENCY_DECIMALS;
  }
  if (amount > 0.01) {
    return SHORT_CRYPTO_CURRENCY_DECIMALS;
  }
  return LONG_CRYPTO_CURRENCY_DECIMALS;
};

// TODO: use a library for this, because the sign does not always appear on the left. (perhaps something like number.toLocaleString)
// export const formatCurrencyWithSign = (
//   sign: string | null | undefined,
//   value: NumericValue,
//   decimals?: number
// ) => `${sign}${formatCurrency(String(value), decimals || getPrecision(value))}`;

// export const formatCurrencyWithKey = (
//   currencyKey: CurrencyKey,
//   value: NumericValue,
//   decimals?: number
// ) =>
//   `${formatCurrency(
//     String(value),
//     decimals || getPrecision(value)
//   )} ${currencyKey}`;

// export function formatUnits(
//   value: any,
//   units: number,
//   decimals?: number
// ): string {
//   return formatNumber(toBN(value.toString()).dividedBy(toBN(10).pow(units)), {
//     decimals: decimals,
//   });
// }

export function cRatioToPercent(cRatio: BN): number {
  const cRatioPercent = cRatio.isZero() ? toBN(0) : toBN(100).div(cRatio);
  return cRatioPercent.isNaN() ? 0 : Number(cRatioPercent.toFixed(2));
}
export function formatCRatioToPercent(cRatio: BN): string {
  const cRatioPercent = cRatioToPercent(cRatio);

  const percent = formatNumber(cRatioPercent);

  if (cRatioPercent > 10_000_000) {
    return numbro(cRatioPercent).format({
      average: true,
      mantissa: 2,
    });
  }

  return percent;
}
