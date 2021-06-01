import { useEffect } from "react";
import { useQueryClient } from "react-query";
import { useSnackbar } from "notistack";
import { NetworkId } from "@horizon-protocol/contracts-interface";
import { useUpdateAtom } from "jotai/utils";
import { readyAtom } from "@atoms/app";
import horizon from "@lib/horizon";
import { ChainId } from "@utils/constants";
import useWallet from "./useWallet";
import useRpcProvider from "./useRpcProvider";

export default function useSetupHorizonLib() {
  const setAppReady = useUpdateAtom(readyAtom);
  const { enqueueSnackbar } = useSnackbar();

  const rpcProvider = useRpcProvider();

  const { connected, chainId, provider } = useWallet();

  const queryClient = useQueryClient();

  useEffect(() => {
    try {
      if (connected && provider) {
        const signer = provider.getSigner();
        horizon.setContractSettings({
          networkId: chainId as NetworkId,
          provider,
          signer,
        });
      } else if (rpcProvider) {
        horizon.setContractSettings({
          networkId: ChainId,
          provider: rpcProvider,
        });
      }
      queryClient.setDefaultOptions({
        queries: {
          enabled: !!horizon.js,
        },
      });
      setAppReady(!!horizon.js);
    } catch (error) {
      enqueueSnackbar("Failed to initiate horizon.js sdk!", {
        variant: "error",
      });
    }
  }, [
    connected,
    provider,
    chainId,
    rpcProvider,
    enqueueSnackbar,
    queryClient,
    setAppReady,
  ]);

  return horizon;
}
