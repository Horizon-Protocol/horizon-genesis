import initHorizonJS, {
  NetworkId,
  NetworkName,
  Token,
  Synth,
  HorizonJS,
} from "@horizon-protocol/contracts-interface";
import { ethers, Signer } from "ethers";

import keyBy from "lodash/keyBy";
import invert from "lodash/invert";

export type Feed = {
  asset: string;
  category: string;
  description?: string;
  exchange?: string;
  feed?: string;
  sign: string;
};

export type SynthsMap = Record<string, Synth>;

export type TokensMap = Record<string, Token>;

type ContractSettings = {
  networkId: NetworkId;
  jsonRpcProvider?: ethers.providers.Provider;
  provider?: ethers.providers.Provider;
  signer?: Signer;
  useOvm?: boolean;
};

export type Horizon = {
  js: HorizonJS | null;
  js2: HorizonJS | null; //only write data with using wallet provider
  setContractSettings: (contractSettings: ContractSettings) => void;
  synthsMap: SynthsMap | null;
  tokensMap: TokensMap | null;
  synthSummaryUtil: ethers.Contract | null;
  chainIdToNetwork: Record<NetworkId, NetworkName> | null;
};

const horizon: Horizon = {
  js: null,
  js2: null,
  synthSummaryUtil: null,
  synthsMap: null,
  tokensMap: null,
  chainIdToNetwork: null,

  setContractSettings({ networkId, jsonRpcProvider, provider, signer }: ContractSettings) {
    this.js = initHorizonJS({
      networkId,
      provider: jsonRpcProvider
    });

    this.js2 = initHorizonJS({
      networkId,
      provider,
      signer,
    });
    console.log('initHorizonJS',this.js,this.js2)

    this.synthsMap = keyBy(this.js.synths, "name");
    this.tokensMap = keyBy(this.js.tokens, "symbol");

    this.chainIdToNetwork = invert(this.js.networkToChainId) as Record<
      NetworkId,
      NetworkName
    >;
  },
};

declare global {
  interface Window {
    $horizon?: Horizon;
  }
}
window.$horizon = horizon;

export type { Synth };
export default horizon;
