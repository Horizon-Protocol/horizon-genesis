import { DefaultOptions } from "react-query";
import BinanceLogo from "@assets/wallets/binance.svg";
import MetamaskLogo from "@assets/wallets/metamask.svg";
import TrustLogo from "@assets/wallets/trust.svg";

export enum Action {
  Stake = 1,
  Unstake,
}

export enum Token {
  PHB = "PHB",
  HZN = "HZN",
  HZN_BNB_LP = "HZN-BNB LP",
  HZN_BNB_LP_DEPRECATED = "HZN-BNB LP Deprecated",
  HZN_BNB_LP_LEGACY = "HZN-BNB LP Legacy",
}

export const TokenName = {
  [Token.PHB]: "PHB",
  [Token.HZN]: "HZN",
  [Token.HZN_BNB_LP]: "HZN-BNB LP",
  [Token.HZN_BNB_LP_DEPRECATED]: "HZN-BNB LP",
  [Token.HZN_BNB_LP_LEGACY]: "HZN-BNB LP",
};

export const TokenShortName = {
  [Token.PHB]: "PHB",
  [Token.HZN]: "HZN",
  [Token.HZN_BNB_LP]: "LP",
  [Token.HZN_BNB_LP_DEPRECATED]: "LP",
  [Token.HZN_BNB_LP_LEGACY]: "LP",
};

export enum SupportedWallet {
  Metamask = "Metamask",
  Binance = "Binance",
  Trust = "Trust",
}

declare global {
  type ActionEnum = Action;
  type TokenEnum = Token;
  type SupportedWalletEnum = SupportedWallet;

  interface WalletDetail {
    key: SupportedWalletEnum;
    label: string;
    logo: string;
    connectorId: ConnectorNames;
  }
}

export enum ConnectorNames {
  Injected = "injected",
  BSC = "bsc",
}

export const SUPPORTED_WALLETS: WalletDetail[] = [
  {
    key: SupportedWallet.Metamask,
    label: "Metamask",
    logo: MetamaskLogo,
    connectorId: ConnectorNames.Injected,
  },
  {
    key: SupportedWallet.Binance,
    label: "Binance Wallet",
    logo: BinanceLogo,
    connectorId: ConnectorNames.BSC,
  },
  {
    key: SupportedWallet.Trust,
    label: "Trust Wallet",
    logo: TrustLogo,
    connectorId: ConnectorNames.Injected,
  },
];

export const CHAIN_NAME_MAP: {
  [chain: number]: string;
} = {
  56: "BSC MAINNET",
  97: "BSC TESTNET",
};

export const CHAIN_EXPLORER_URL_MAP: {
  [chain: number]: string;
} = {
  56: "https://bscscan.com/",
  97: "https://testnet.bscscan.com/",
};

export const TOKEN_ADDRESS: {
  [chain: number]: {
    [t in Token]: string;
  };
} = {
  56: {
    [Token.PHB]: "0xdff88a0a43271344b760b58a35076bf05524195c",
    [Token.HZN]: "0xc0eff7749b125444953ef89682201fb8c6a917cd",
    [Token.HZN_BNB_LP]: "0xDc9a574b9B341D4a98cE29005b614e1E27430E74",
    [Token.HZN_BNB_LP_DEPRECATED]: "0xf7fcd7e7b3853bf59bca9183476f218ed07ed3b0",
    [Token.HZN_BNB_LP_LEGACY]: "0xee4ca18e91012bf87fefde3dd6723a8834347a4d",
  },
  97: {
    [Token.PHB]: "0xf09f5e21f86692c614d2d7b47e3b9729dc1c436f",
    [Token.HZN]: "0x74ba52975dd4f0a9cde1b8d4d54b808ef9d0a3f8",
    [Token.HZN_BNB_LP]: "0x74ba52975dd4f0a9cde1b8d4d54b808ef9d0a3f8",
    [Token.HZN_BNB_LP_DEPRECATED]: "0x74ba52975dd4f0a9cde1b8d4d54b808ef9d0a3f8",
    [Token.HZN_BNB_LP_LEGACY]: "0x74ba52975dd4f0a9cde1b8d4d54b808ef9d0a3f8",
  },
};

// staking contract
export const STAKING_CONTRACT_ADDRESS: {
  [chain: number]: {
    [t in Token]: string;
  };
} = {
  56: {
    [Token.PHB]: "0xD4552F3e19B91BeD5EF2c76a67ABdbFfeD5caEEC",
    [Token.HZN]: "0x67D5a94F444DF4bBA254645065a4137fc665Bf98",
    [Token.HZN_BNB_LP]: "0x84838d0AB37857fAd5979Fcf6BDDf8ddb1cC1dA8",
    [Token.HZN_BNB_LP_DEPRECATED]: "0x56075e576E59B323E84348877655c56De7cfD6d8",
    [Token.HZN_BNB_LP_LEGACY]: "0xB9C6C9F41d3Da1C81c869e527F7b8f44D6e949b6",
  },
  97: {
    [Token.PHB]: "0x04f8bd779921F3df6EF0E98e4D2fb00D77ae051B",
    [Token.HZN]: "0x19b0E3B2413104b48Dc543A036CF808D5Fcb9d6F",
    [Token.HZN_BNB_LP]: "0x19b0E3B2413104b48Dc543A036CF808D5Fcb9d6F",
    [Token.HZN_BNB_LP_DEPRECATED]: "0x19b0E3B2413104b48Dc543A036CF808D5Fcb9d6F",
    [Token.HZN_BNB_LP_LEGACY]: "0x19b0E3B2413104b48Dc543A036CF808D5Fcb9d6F",
  },
};

const EnvChainId = parseInt(import.meta.env.VITE_APP_CHAIN_ID);

export const ChainId = [56, 97].indexOf(EnvChainId) > -1 ? EnvChainId : 97;

export const ChainName = CHAIN_NAME_MAP[ChainId];
export const ChainExplorerUrl = CHAIN_EXPLORER_URL_MAP[ChainId];
export const TokenAddresses = TOKEN_ADDRESS[ChainId];
export const StakingAddresses = STAKING_CONTRACT_ADDRESS[ChainId];
export const HZNBuyLink = `https://exchange.pancakeswap.finance/#/swap?outputCurrency=${
  TokenAddresses[Token.HZN]
}`;

// BSC 3 seconds per block
export const BSC_BLOCK_TIME = 3;

// BSC Blocks per year
export const BLOCKS_PER_YEAR = (60 / BSC_BLOCK_TIME) * 60 * 24 * 365; // 10512000

export const DEPRECATED_TOKENS = [
  // Token.HZN,
  Token.HZN_BNB_LP_DEPRECATED,
  Token.HZN_BNB_LP_LEGACY,
];

// react query default options
export const REACT_QUERY_DEFAULT_OPTIONS: Partial<DefaultOptions["queries"]> = {
  staleTime: Infinity,
  refetchInterval: 15000, // 15s,
};
