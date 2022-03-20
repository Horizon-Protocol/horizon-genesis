import initHorizonJS, {
  NetworkId,
  Network,
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
  provider?: ethers.providers.Provider;
  signer?: Signer;
  useOvm?: boolean;
};

export type Horizon = {
  js: HorizonJS | null;
  setContractSettings: (contractSettings: ContractSettings) => void;
  synthsMap: SynthsMap | null;
  tokensMap: TokensMap | null;
  synthSummaryUtil: ethers.Contract | null;
  chainIdToNetwork: Record<NetworkId, Network> | null;
};

const horizon: Horizon = {
  js: null,
  synthSummaryUtil: null,
  synthsMap: null,
  tokensMap: null,
  chainIdToNetwork: null,

  setContractSettings({ networkId, provider, signer }: ContractSettings) {
    this.js = initHorizonJS({
      networkId,
      provider,
      signer,
    });

    this.synthsMap = keyBy(this.js.synths, "name");
    this.tokensMap = keyBy(this.js.tokens, "symbol");

    // @ts-ignore
    this.chainIdToNetwork = invert(this.js.networkToChainId);
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
