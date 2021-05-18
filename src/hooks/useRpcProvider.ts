import { useMemo } from "react";
import { providers } from "ethers";
import { ChainId, ChainName } from "@utils/constants";
import { getRpcUrl } from "@utils/rpcUrl";

const rpcUrl = getRpcUrl();

export default function useRpcProvider() {
  const provider = useMemo(
    () =>
      new providers.JsonRpcProvider(rpcUrl, {
        name: ChainName,
        chainId: ChainId,
      }),
    []
  );

  return provider;
}
