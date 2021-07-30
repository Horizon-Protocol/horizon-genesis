import { useState, useEffect, useMemo } from "react";
import { Contract, ContractInterface } from "ethers";
import erc20Abi from "@abis/erc20.json";
import hznAbi from "@abis/HZN.json";
import { Erc20, HZN } from "@abis/types";
import useWallet from "@hooks/useWallet";
import { TokenAddresses, Token } from "@utils/constants";
import useRpcProvider from "./useRpcProvider";

const useContract = <T>(
  address: string,
  abi: ContractInterface,
  writable: boolean = false
) => {
  const { provider } = useWallet();

  const [contract, setContract] = useState<Contract>();

  useEffect(() => {
    if (address && provider) {
      if (writable) {
        setContract(new Contract(address, abi, provider.getSigner()));
      } else {
        setContract(new Contract(address, abi, provider));
      }
    }
  }, [address, abi, provider, writable]);

  return contract as T | undefined;
};

export const useRpcContract = <T>(address: string, abi: ContractInterface) => {
  const rpcProvider = useRpcProvider();
  const contract = useMemo(
    () => new Contract(address, abi, rpcProvider),
    [abi, address, rpcProvider]
  );

  return contract as unknown as T;
};

export const useERC20 = (address: string, writable: boolean = false) => {
  return useContract<Erc20>(address, erc20Abi, writable);
};

export const usePHB = (writable: boolean = false) => {
  return useERC20(TokenAddresses[Token.PHB], writable);
};

export const useHZN = (writable: boolean = false) => {
  return useContract<HZN>(TokenAddresses[Token.HZN], hznAbi, writable);
};

export const useZUSDLP = (writable: boolean = false) => {
  return useERC20(TokenAddresses[Token.ZUSD_BUSD_LP], writable);
};

export const useLP = (writable: boolean = false) => {
  return useERC20(TokenAddresses[Token.HZN_BNB_LP], writable);
};

export const useLegacyLP = (writable: boolean = false) => {
  return useERC20(TokenAddresses[Token.HZN_BNB_LP_LEGACY], writable);
};

export default useContract;
