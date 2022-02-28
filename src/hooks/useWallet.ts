import { useCallback, useMemo, useState } from "react";
import { useSnackbar } from "notistack";
import { providers } from "ethers";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { NoBscProviderError } from "@binance-chain/bsc-connector";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { useUpdateAtom } from "jotai/utils";

import { prevWalletNameAtom } from "@atoms/wallet";
import { connectorsByName } from "@utils/web3React";
import { ChainName, ConnectorNames } from "@utils/constants";
import { formatAddress } from "@utils/formatters";
import { setupNetwork } from "@utils/wallet";

export default function useWallet() {
  const { enqueueSnackbar } = useSnackbar();
  const setPrevWalletName = useUpdateAtom(prevWalletNameAtom);

  const { account, activate, chainId, deactivate, library, active } =
    useWeb3React<providers.Web3Provider>();

  const [connecting, setConnecting] = useState(false);

  const connectWallet = useCallback(
    async ({ key, connectorId }: WalletDetail) => {
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
      setPrevWalletName(key);
    },
    [activate, enqueueSnackbar, setPrevWalletName]
  );

  const shortAccount = useMemo(
    () => (account ? formatAddress(account) : ""),
    [account]
  );
  const address = useMemo(() => account|| "", [account]);
  // const address = useMemo(() => "0x8660684212F371F1834de5651F609af5D7F648F7" || "", [account]);

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
