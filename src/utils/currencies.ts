import {
  CurrencyKey as ICurrencyKey,
  Synth as ISynth,
  Synths as ISynths,
  Token as IToken,
} from "@horizon-protocol/contracts-interface";

declare global {
  type CurrencyKey = ICurrencyKey;
  type Synth = ISynth;
  type Synths = ISynths;
  type Token = IToken;
}

// export type CurrencyKey = string;

// export type CryptoBalance = {
//   currencyKey: CurrencyKey;
//   balance: BN;
//   usdBalance: BN;
//   synth?: string;
//   transferrable?: BN;
// };

export type SynthBalancesMap = Record<CurrencyKey, BN>;

export type Asset = {
  currencyKey: string;
  balance: BN;
};

export type Rates = Record<CurrencyKey, number>;
export type ParitalRates = Partial<Rates>;

// export enum ZAssests {
//   zUSD = "zUSD",
//   zBTC = "zBTC",
//   zETH = "zETH",
//   iBTC = "iBTC",
//   iETH = "iETH",
// }

export enum CryptoCurrency {
  HZN = "HZN",
  BTC = "BTC",
  BNB = "BNB",
  ETH = "ETH",
}

export const zUSD_EXCHANGE_RATE = 1;

export const FIAT_ZASSETS = new Set<CurrencyKey>(["zUSD"]);

export const isFiatCurrency = (currencyKey: CurrencyKey) =>
  FIAT_ZASSETS.has(currencyKey as CurrencyKey);

export const toInverseSynth = (currencyKey: CurrencyKey) =>
  currencyKey.replace(/^z/i, "i");

export const toStandardSynth = (currencyKey: CurrencyKey) =>
  currencyKey.replace(/^i/i, "z");

export const synthToAsset = (currencyKey: CurrencyKey) =>
  currencyKey.replace(/^(i|z)/i, "");

export const assetToSynth = (currencyKey: CurrencyKey) => `z${currencyKey}`;

export const iStandardSynth = (currencyKey: CurrencyKey) =>
  currencyKey.startsWith("z");
