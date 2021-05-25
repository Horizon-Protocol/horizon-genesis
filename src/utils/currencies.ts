export type CurrencyKey = string;

export type CryptoBalance = {
  currencyKey: CurrencyKey;
  balance: BN;
  usdBalance: BN;
  synth?: string;
  transferrable?: BN;
};

export type SynthBalancesMap = Record<CurrencyKey, CryptoBalance>;

export type Asset = {
  currencyKey: string;
  balance: BN;
};

export type Rates = Record<CurrencyKey, number>;

export enum ZAssests {
  zUSD = "zUSD",
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

export const FIAT_ZASSETS = new Set([ZAssests.zUSD]);

export const isFiatCurrency = (currencyKey: CurrencyKey) =>
  FIAT_ZASSETS.has(currencyKey as ZAssests);

export const toInverseSynth = (currencyKey: CurrencyKey) =>
  currencyKey.replace(/^s/i, "i");
export const toStandardSynth = (currencyKey: CurrencyKey) =>
  currencyKey.replace(/^i/i, "s");
export const synthToAsset = (currencyKey: CurrencyKey) =>
  currencyKey.replace(/^(i|s)/i, "");
export const assetToSynth = (currencyKey: CurrencyKey) => `s${currencyKey}`;
export const iStandardSynth = (currencyKey: CurrencyKey) =>
  currencyKey.startsWith("s");
