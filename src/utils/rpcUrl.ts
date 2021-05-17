import random from "lodash/random";

// List of available rpc nodes to connect to
export const rpcNodes = [
  "https://bsc-dataseed.binance.org/",
  "https://bsc-dataseed1.defibit.io/",
  "https://bsc-dataseed1.ninicoin.io/",
];

export const getRpcUrl = () => {
  const randomIndex = random(0, rpcNodes.length - 1);
  return rpcNodes[randomIndex];
};
