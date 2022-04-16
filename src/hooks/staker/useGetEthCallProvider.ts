import { useCallback } from "react";
import { Provider } from "@horizon-protocol/ethcall";
import useRpcProvider from "../useRpcProvider";

export default function useGetEthCallProvider() {
  const rpcProvider = useRpcProvider();

  const getProvider = useCallback(async () => {
    const ethcallProvider = new Provider();
    await ethcallProvider.init(rpcProvider as any);
    return ethcallProvider;
  }, [rpcProvider]);

  return getProvider;
}
