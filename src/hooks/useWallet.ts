import { useCallback, useMemo, useState } from "react";
import { useSnackbar } from "notistack";
import { providers } from "ethers";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { NoBscProviderError } from "@binance-chain/bsc-connector";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";

import { connectorsByName } from "@utils/web3React";
import { ChainName, ConnectorNames } from "@utils/constants";
import { formatAddress } from "@utils/formatters";
import { setupNetwork } from "@utils/wallet";

export default function useWallet() {
  const { enqueueSnackbar } = useSnackbar();

  const { account, activate, chainId, deactivate, library, active } =
    useWeb3React<providers.Web3Provider>();

  const [connecting, setConnecting] = useState(false);

  const connectWallet = useCallback(
    async (connectorId: ConnectorNames) => {
      const connector = connectorsByName[connectorId];
      const isInjected = connectorId === ConnectorNames.Injected;
      setConnecting(true);
      await activate(connector, async (error) => {
        let errorMsg = "";
        if (error instanceof UnsupportedChainIdError) {
          if (isInjected) {
            const hasSetup = await setupNetwork();
            if (hasSetup) {
              await activate(connector);
            } else {
              errorMsg = "Please switch to Binance Smart Chain";
            }
          } else {
            errorMsg = "Please switch to Binance Smart Chain";
          }
        } else {
          // window.localStorage.removeItem(connectorLocalStorageKey)
          errorMsg = "Failed to connect wallet";
          if (
            error instanceof NoEthereumProviderError ||
            error instanceof NoBscProviderError
          ) {
            errorMsg = "No provider was found";
          } else if (error instanceof UserRejectedRequestErrorInjected) {
            errorMsg = "Please authorize to access your account";
          } else {
            if (error.message.indexOf("Binance-Chain-Tigris") > -1) {
              errorMsg = "Please switch to Binance Smart Chain";
            }
            console.log(error.name, error.message);
          }
        }
        if (errorMsg) {
          enqueueSnackbar(errorMsg, { variant: "error" });
        }
      });

      setConnecting(false);
    },
    [activate, enqueueSnackbar]
  );

  const shortAccount = useMemo(
    () => (account ? formatAddress(account) : ""),
    [account]
  );
  const address = useMemo(() => account || "", [account]);

  return {
    account: address,
    activate,
    chainId,
    deactivate,
    connecting,
    connected: active,
    shortAccount,
    provider: library,
    ChainName,
    connectWallet,
  };
}
