import { Erc20 } from "@abis/types";
import erc20Abi from "@abis/erc20.json";
import { Contract } from "@horizon-protocol/ethcall";
import { Token, TokenAddresses } from "./constants";

export const getMultiCallContract = <T extends { callStatic: any }>(
  address: string,
  abi: any[]
) => {
  const contract = new Contract(address, abi);

  return contract as Contract & { [k in keyof T["callStatic"]]: any };
};

export const tokenContractMap: {
  [t: string]: Contract & {
    [k in keyof Erc20["callStatic"]]: any;
  };
} = {
  BUSD: getMultiCallContract<Erc20>(
    "0xe9e7cea3dedca5984780bafc599bd69add087d56",
    erc20Abi
  ),
};

Object.values(Token).forEach((token) => {
  tokenContractMap[token as TokenEnum] = getMultiCallContract<Erc20>(
    TokenAddresses[token as Token],
    erc20Abi
  );
});

console.log("====tokenContractMap", tokenContractMap);
