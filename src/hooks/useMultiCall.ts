import { useCallback, useMemo } from "react";
import { BaseContract } from "ethers";
import { Contract, Provider } from "@horizon-protocol/ethcall";
import useRpcProvider from "./useRpcProvider";

export const useMultiCallContract = <T extends BaseContract>(
  address: string,
  abi: any[]
) => {
  const contract = useMemo(() => new Contract(address, abi), [abi, address]);

  return contract as Contract & { [k in keyof T["callStatic"]]: any };
};

export default function useMultiCall() {
  const rpcProvider = useRpcProvider();

  const getMultiCallProvider = useCallback(async () => {
    const ethcallProvider = new Provider();
    await ethcallProvider.init(rpcProvider as any);
    return ethcallProvider;
  }, [rpcProvider]);

  return getMultiCallProvider;
}