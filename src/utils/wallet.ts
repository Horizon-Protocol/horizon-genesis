// Set of helper functions to facilitate wallet setup

import { ChainId, ChainExplorerUrl, Token, TokenAddresses } from "./constants";
import { RPC_NODES } from "./rpcUrl";

/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async () => {
  const provider = window.ethereum;
  if (provider?.request) {
    try {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${ChainId.toString(16)}`,
            chainName: "Binance Smart Chain Mainnet",
            nativeCurrency: {
              name: "BNB",
              symbol: "bnb",
              decimals: 18,
            },
            rpcUrls: RPC_NODES,
            blockExplorerUrls: [ChainExplorerUrl],
          },
        ],
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  } else {
    console.error(
      "Can't setup the BSC network on metamask because window.ethereum is undefined"
    );
    return false;
  }
};

interface RegisterTokenParams {
  address: string;
  symbol: string;
  decimals: number;
  logo: string;
}

export const RegisterTokenConf: {
  [t in TokenEnum]?: RegisterTokenParams;
} = {
  [Token.PHB]: {
    address: TokenAddresses[Token.PHB],
    symbol: "PHB V2",
    decimals: 18,
    logo: "",
  },
  [Token.PHB_LEGACY]: {
    address: TokenAddresses[Token.PHB_LEGACY],
    symbol: "PHB V1",
    decimals: 18,
    logo: "",
  },
  [Token.HZN_BNB_LP]: {
    address: TokenAddresses[Token.HZN_BNB_LP],
    symbol: "HZN-BNB",
    decimals: 18,
    logo: "",
  },
  [Token.HZN_BNB_LP_LEGACY]: {
    address: TokenAddresses[Token.HZN_BNB_LP_LEGACY],
    symbol: "HZN-BNB Old",
    decimals: 18,
    logo: "",
  },
  [Token.ZUSD_BUSD_LP]: {
    address: TokenAddresses[Token.ZUSD_BUSD_LP],
    symbol: "zUSD-BUSD",
    decimals: 18,
    logo: "",
  },
  [Token.HZN]: {
    address: TokenAddresses[Token.HZN],
    symbol: "HZN",
    decimals: 18,
    logo: "",
  },
  [Token.ZUSD]: {
    address: TokenAddresses[Token.ZUSD],
    symbol: "zUSD",
    decimals: 18,
    logo: "",
  },
};

/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @returns {boolean} true if the token has been added, false otherwise
 */
export const registerToken = async ({
  address,
  symbol,
  decimals,
  logo,
}: RegisterTokenParams) => {
  const tokenAdded = await window.ethereum!.request!({
    method: "wallet_watchAsset",
    params: {
      type: "ERC20",
      options: {
        address,
        symbol,
        decimals,
        image: logo,
      },
    },
  });

  return tokenAdded;
};
