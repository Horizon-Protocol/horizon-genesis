import { useCallback, useMemo } from "react";
import { Contract, Provider } from "@horizon-protocol/ethcall";
import useRpcProvider from "./useRpcProvider";

export const getMultiCallContract = <T extends { callStatic: any }>(
  address: string,
  abi: any[]
) => {
  const contract = new Contract(address, abi);

  return contract as Contract & { [k in keyof T["callStatic"]]: any };
};
export const useMultiCallContract = <T extends { callStatic: any }>(
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
