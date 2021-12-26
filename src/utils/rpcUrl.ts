import random from "lodash/random";
import { ChainId } from "./constants";

// List of available rpc nodes to connect to
const RPC_NODES_MAP: { [chain: number]: string[] } = {
  56: [
    "https://bsc-dataseed.binance.org/",
    "https://bsc-dataseed1.defibit.io/",
    "https://bsc-dataseed1.ninicoin.io/",
  ],
  97: [
    "https://data-seed-prebsc-1-s1.binance.org:8545/",
    // "https://data-seed-prebsc-1-s2.binance.org:8545/",
    // "https://data-seed-prebsc-1-s3.binance.org:8545/",
  ],
};

export const RPC_NODES = RPC_NODES_MAP[ChainId];

export const getRpcUrl = () => {
  const randomIndex = random(0, RPC_NODES.length - 1);
  return RPC_NODES[randomIndex];
};

export default getRpcUrl;
