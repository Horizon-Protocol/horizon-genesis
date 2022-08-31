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
  PHB_LEGACY = "PHB Legacy",
  WBNB = "WBNB",
  BNB = "BNB",
  BUSD = "BUSD",
  HZN = "HZN",
  ZUSD = "zUSD",
  ZBNB = "zBNB",
  ZUSD_BUSD_LP = "zUSD-BUSD LP",
  ZBNB_BNB_LP = "zBNB-BNB LP",
  HZN_BNB_LP = "HZN-BNB LP",
  HZN_BNB_LP_LEGACY = "HZN-BNB LP Legacy",
}

export const TokenName = {
  [Token.PHB]: "PHB",
  [Token.PHB_LEGACY]: "PHB",
  [Token.WBNB]: "WBNB",
  [Token.BNB]: "BNB",
  [Token.BUSD]: "BUSD",
  [Token.HZN]: "HZN",
  [Token.ZUSD]: "zUSD",
  [Token.ZBNB]: "zBNB",
  [Token.ZUSD_BUSD_LP]: "zUSD-BUSD",
  [Token.ZBNB_BNB_LP]: "zBNB-BNB",
  [Token.HZN_BNB_LP]: "HZN-BNB",
  [Token.HZN_BNB_LP_LEGACY]: "HZN-BNB",
};

export const TokenShortName = {
  [Token.PHB]: "PHB",
  [Token.PHB_LEGACY]: "PHB",
  [Token.WBNB]: "WBNB",
  [Token.BNB]: "BNB",
  [Token.BUSD]: "BUSD",
  [Token.HZN]: "HZN",
  [Token.ZUSD]: "zUSD",
  [Token.ZBNB]: "zBNB",
  [Token.ZUSD_BUSD_LP]: "LP",
  [Token.ZBNB_BNB_LP]: "LP",
  [Token.HZN_BNB_LP]: "LP",
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
    [Token.PHB]: "0x0409633A72D846fc5BBe2f98D88564D35987904D",
    [Token.PHB_LEGACY]: "0xdff88a0a43271344b760b58a35076bf05524195c",
    [Token.WBNB]: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
    [Token.BNB]: "0x51d5B7A71F807C950A45dD8b1400E83826Fc49F3", //Ellipsis pool contract can find BNB balance via get_balances
    [Token.BUSD]: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    [Token.HZN]: "0xc0eff7749b125444953ef89682201fb8c6a917cd",
    [Token.ZUSD]: "0xF0186490B18CB74619816CfC7FeB51cdbe4ae7b9",
    [Token.ZBNB]: "0x51d5B7A71F807C950A45dD8b1400E83826Fc49F3", //Use Ellipsis pool contract to get balance instead of token address - 0x6DEdCEeE04795061478031b1DfB3c1ddCA80B204
    [Token.ZBNB_BNB_LP]: "0x608d2FafbbCa409a60d2Acb5D41DDD37642a1275", //0x608d2FafbbCa409a60d2Acb5D41DDD37642a1275
    [Token.ZUSD_BUSD_LP]: "0xc3bf4e0ea6b76c8edd838e14be2116c862c88bdf",
    [Token.HZN_BNB_LP]: "0xDc9a574b9B341D4a98cE29005b614e1E27430E74",
    // [Token.HZN_BNB_LP_DEPRECATED]: "0xf7fcd7e7b3853bf59bca9183476f218ed07ed3b0",
    [Token.HZN_BNB_LP_LEGACY]: "0xee4ca18e91012bf87fefde3dd6723a8834347a4d",
  },
  97: {
    [Token.PHB]: "0xf09f5e21f86692c614d2d7b47e3b9729dc1c436f",
    [Token.PHB_LEGACY]: "0xf09f5e21f86692c614d2d7b47e3b9729dc1c436f",
    [Token.WBNB]: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
    [Token.BNB]: "",
    [Token.BUSD]: "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee",
    [Token.HZN]: "0xd582733b8ce3b84fcfad9373626c89c7d5606e30",
    [Token.ZUSD]: "0x42c104EC42713466C04ecC83DB64587EbC03a345",
    [Token.ZBNB]: "",
    [Token.ZBNB_BNB_LP]: "",
    [Token.ZUSD_BUSD_LP]: "0x575Cb459b6E6B8187d3Ef9a25105D64011874820",
    [Token.HZN_BNB_LP]: "0xdadd300a217603ad399c822919c7df1c9b682663",
    [Token.HZN_BNB_LP_LEGACY]: "0xdadd300a217603ad399c822919c7df1c9b682663",
  },
};

// staking contract
export const STAKING_CONTRACT_ADDRESS: {
  [chain: number]: {
    [t in Token]: string;
  };
} = {
  56: {
    [Token.PHB]: "0xa1771DCfb7822C8853D7E64B86E58f7f1eB5e33E",
    [Token.PHB_LEGACY]: "0xD4552F3e19B91BeD5EF2c76a67ABdbFfeD5caEEC",
    [Token.WBNB]: "",
    [Token.BNB]: "",
    [Token.BUSD]: "",
    [Token.HZN]: "0x67D5a94F444DF4bBA254645065a4137fc665Bf98",
    [Token.ZUSD]: "",
    [Token.ZBNB]: "",
    [Token.ZBNB_BNB_LP]: "0x307326d24b5287b12f8079ba3854d9f7e7a139e1",
    [Token.ZUSD_BUSD_LP]: "0x5646aA2F9408C7c2eE1dC7db813C8B687A959a85",
    [Token.HZN_BNB_LP]: "0x84838d0AB37857fAd5979Fcf6BDDf8ddb1cC1dA8",
    // [Token.HZN_BNB_LP_DEPRECATED]: "0x56075e576E59B323E84348877655c56De7cfD6d8",
    [Token.HZN_BNB_LP_LEGACY]: "0xB9C6C9F41d3Da1C81c869e527F7b8f44D6e949b6",
  },
  97: {
    [Token.PHB]: "0x04f8bd779921F3df6EF0E98e4D2fb00D77ae051B",
    [Token.PHB_LEGACY]: "0x04f8bd779921F3df6EF0E98e4D2fb00D77ae051B",
    [Token.WBNB]: "",
    [Token.BNB]: "",
    [Token.BUSD]: "",
    [Token.HZN]: "0x19b0E3B2413104b48Dc543A036CF808D5Fcb9d6F",
    [Token.ZUSD]: "",
    [Token.ZBNB]: "",
    [Token.ZBNB_BNB_LP]: "",
    [Token.ZUSD_BUSD_LP]: "0x19b0E3B2413104b48Dc543A036CF808D5Fcb9d6F",
    [Token.HZN_BNB_LP]: "0x19b0E3B2413104b48Dc543A036CF808D5Fcb9d6F",
    [Token.HZN_BNB_LP_LEGACY]: "0x19b0E3B2413104b48Dc543A036CF808D5Fcb9d6F",
  },
};

const VERSION = import.meta.env.VITE_APP_COMMIT_VERSION;
console.log("GENESIS", VERSION);
const EnvChainId = parseInt(import.meta.env.VITE_APP_CHAIN_ID);

// export const ChainId = [56, 97].indexOf(EnvChainId) > -1 ? EnvChainId : 97;
export const ChainId = 56;

export const ChainName = CHAIN_NAME_MAP[ChainId];
export const ChainExplorerUrl = CHAIN_EXPLORER_URL_MAP[ChainId];
export const TokenAddresses = TOKEN_ADDRESS[ChainId];
export const StakingAddresses = STAKING_CONTRACT_ADDRESS[ChainId];
export const HZNBuyLink = `https://pancakeswap.finance/swap?outputCurrency=${
  TokenAddresses[Token.HZN]
}`;

// BSC 3 seconds per block
export const BSC_BLOCK_TIME = 3;

// BSC Blocks per year
export const BLOCKS_PER_YEAR = (60 / BSC_BLOCK_TIME) * 60 * 24 * 365; // 10512000

// react query default options
export const REFETCH_INTERVAL = 15000;

export const REACT_QUERY_DEFAULT_OPTIONS: Partial<DefaultOptions["queries"]> = {
  refetchInterval: REFETCH_INTERVAL, // 15s,
  refetchIntervalInBackground: false,
  refetchOnMount: true,
  refetchOnWindowFocus: false,
};

//horizon subgraphs endpoint
export const GRAPH_ENDPOINT = (path:string = 'bsc15-issuance') => {
  return {
    56: `https://api.thegraph.com/subgraphs/name/rout-horizon/${path}`,
    97: "https://api.thegraph.com/subgraphs/name/rout-horizon/chapel14-issuance",
  }[ChainId]!
};

export const LINK_EXCHANGE = {
  56: "https://exchange.horizonprotocol.com/",
  97: "https://exchange-testnet.horizonprotocol.com/",
}[ChainId]!;

export const DEPLOY_DATES = {
  [Token.ZBNB_BNB_LP]: 1656986400, // Official Launch Timestamp 1656993600 (-2hours: 1656986400) - Test timestamp 1656716364
};
