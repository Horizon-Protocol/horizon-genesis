import { BigNumber } from "ethers";

export type CurrencyKey = string;

export type CryptoBalance = {
  currencyKey: CurrencyKey;
  balance: BigNumber;
  usdBalance: BigNumber;
  synth?: string;
  transferrable?: BigNumber;
};

export type Asset = {
  currencyKey: string;
  balance: BigNumber;
};

export type Rates = Record<CurrencyKey, number>;

export enum ZAssests {
  zBTC = "zBTC",
  zETH = "zETH",
  iBTC = "iBTC",
  iETH = "iETH",
}

export enum CryptoCurrency {
  HZN = "HZN",
  BTC = "BTC",
  BNB = "BNB",
  ETH = "ETH",
}

export const zUSD_EXCHANGE_RATE = 1;

export const toInverseSynth = (currencyKey: CurrencyKey) =>
  currencyKey.replace(/^s/i, "i");
export const toStandardSynth = (currencyKey: CurrencyKey) =>
  currencyKey.replace(/^i/i, "s");
export const synthToAsset = (currencyKey: CurrencyKey) =>
  currencyKey.replace(/^(i|s)/i, "");
export const assetToSynth = (currencyKey: CurrencyKey) => `s${currencyKey}`;
export const iStandardSynth = (currencyKey: CurrencyKey) =>
  currencyKey.startsWith("s");
