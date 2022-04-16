import { useState, useEffect, useMemo } from "react";
import { Contract, ContractInterface } from "ethers";
import erc20Abi from "@contracts/abis/Erc20.json";
import { Erc20 } from "@contracts/typings";
import useWallet from "@hooks/useWallet";
import useRpcProvider from "./useRpcProvider";

const useContract = <T>(
  address: string,
  abi: ContractInterface,
  writable = false
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

export const useERC20 = (address: string, writable = false) => {
  return useContract<Erc20>(address, erc20Abi, writable);
};

export default useContract;
