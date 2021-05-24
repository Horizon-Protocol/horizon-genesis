import { useEffect, useMemo } from "react";
import { useSnackbar } from "notistack";
import { providers } from "ethers";
import { useWallet as useBscWallet } from "@binance-chain/bsc-use-wallet";
import { useUpdateAtom } from "jotai/utils";
import { readyAtom } from "@atoms/app";
import horizon from "@lib/horizon";
import { ChainId, ChainName } from "@utils/constants";
import { formatAddress } from "@utils/formatters";
import useRpcProvider from "./useRpcProvider";

export default function useWallet() {
  const setAppReady = useUpdateAtom(readyAtom);

  const rpcProvider = useRpcProvider();

  const wallet = useBscWallet<providers.ExternalProvider>();

  const { enqueueSnackbar } = useSnackbar();

  const shortAccount = useMemo(
    () => (wallet.account ? formatAddress(wallet.account) : ""),
    [wallet.account]
  );
  const { connecting, connected } = useMemo(
    () => ({
      connecting: wallet.status === "connecting",
      connected: wallet.status === "connected",
    }),
    [wallet.status]
  );

  const provider = useMemo(
    () =>
      wallet.ethereum && wallet.chainId
        ? new providers.Web3Provider(wallet.ethereum, {
            name: ChainName,
            chainId: wallet.chainId,
          })
        : null,
    [wallet.ethereum, wallet.chainId]
  );

  useEffect(() => {
    // connect errors
    if (wallet.error) {
      let errorMsg = "Failed to connect wallet";
      switch (wallet.error.name) {
        case "ChainUnsupportedError":
          errorMsg = "Chain Unsupported Error";
          break;
        case "ConnectorUnsupportedError":
          errorMsg = "Connector Unsupported Error";
          break;
        case "ConnectionRejectedError":
          errorMsg = "Connection Rejected Error";
          break;
        case "ConnectorConfigError":
          errorMsg = "Connector Config Error";
          break;
        default:
          if (wallet.error?.message) {
            errorMsg = wallet.error.message;
            if (errorMsg.indexOf("Invariant failed") > -1) {
              errorMsg = "Please switch wallet network to Binance Smart Chain";
            }
          }
          break;
      }
      enqueueSnackbar(errorMsg, { variant: "error" });
    }
  }, [enqueueSnackbar, wallet.error]);

  useEffect(() => {
    if (rpcProvider && !horizon.js) {
      horizon.setContractSettings({
        networkId: ChainId,
        provider: rpcProvider,
      });
      setAppReady(true);
    }
  }, [rpcProvider, setAppReady]);

  useEffect(() => {
    if (provider && connected) {
      const signer = provider.getSigner();
      horizon.setContractSettings({
        networkId: wallet.chainId as any,
        provider,
        signer,
      });
      setAppReady(true);
    }
  }, [connected, provider, setAppReady, wallet]);

  return {
    ...wallet,
    connecting,
    connected,
    shortAccount,
    provider,
    ChainName,
  };
}
