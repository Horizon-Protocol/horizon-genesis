import { InjectedConnector } from "@web3-react/injected-connector";
import { BscConnector } from "@binance-chain/bsc-connector";
import { providers } from "ethers";
import { ChainId, ConnectorNames } from "./constants";

const injected = new InjectedConnector({ supportedChainIds: [ChainId] });

const bscConnector = new BscConnector({ supportedChainIds: [ChainId] });

export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.BSC]: bscConnector,
};

// called when connectint to wallet.
export const getLibrary = <T>(provider: T): providers.Web3Provider => {
  return new providers.Web3Provider(provider);
};
