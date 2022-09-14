import { useCallback, useEffect, useMemo, useState } from "react";
import { useSnackbar } from "notistack";
import { providers } from "ethers";
// import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { NoBscProviderError } from "@binance-chain/bsc-connector";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { useUpdateAtom, useAtomValue } from "jotai/utils";
import { prevWalletNameAtom } from "@atoms/wallet";
// import { connectorsByName } from "@utils/web3React";
import { ChainName, ConnectorNames } from "@utils/constants";
import { formatAddress } from "@utils/formatters";
import { setupNetwork } from "@utils/wallet";
import { watchAccountAtom } from "@components/DevWatchTool";
import { useConnect, useDisconnect, useNetwork,useAccount, ConnectorNotFoundError, UserRejectedRequestError } from 'wagmi'
import { ChainId } from "@utils/constants";

export default function useWallet() {
  const { enqueueSnackbar } = useSnackbar();
  const setPrevWalletName = useUpdateAtom(prevWalletNameAtom);

  // const { account, activate, chainId, deactivate, library, active } =
  //   useWeb3React<providers.Web3Provider>();

    const { connectAsync, connectors } = useConnect()
    const { chain } = useNetwork()
    const { disconnectAsync } = useDisconnect()
    const { address, connector, isConnected, isConnecting } = useAccount()

    // const { toastError } = useToast()
    // const { chainId } = useActiveChainId()
    // const [, setSessionChainId] = useSessionChainId()

    const [connecting, setConnecting] = useState(false);




    const connectWallet = useCallback(




    
    

    async ({ key, connectorId }: WalletDetail) => {
      const findConnector = connectors.find((c) => c.id === connectorId)
      try {
        const connected = await connectAsync({ connector: findConnector, chainId: ChainId })
        if (!connected.chain.unsupported && connected.chain.id !== ChainId) {
          alert('error123')
          // replaceBrowserHistory('chainId', connected.chain.id)
          // setSessionChainId(connected.chain.id)
        }
      } catch (error) {
        console.error(error)
        // window?.localStorage?.removeItem(connectorLocalStorageKey)
        if (error instanceof ConnectorNotFoundError) {
          alert('error345')
          // toastError(
          //   t('Provider Error'),
          //   <Box>
          //     <Text>{t('No provider was found')}</Text>
          //     <LinkExternal href="https://docs.pancakeswap.finance/get-started/connection-guide">
          //       {t('Need help ?')}
          //     </LinkExternal>
          //   </Box>,
          // )
          return
        }
        if (error instanceof UserRejectedRequestError) {
          return
        }
        if (error instanceof Error) {
          alert('Please authorize to access your account')
          // toastError(error.message, t('Please authorize to access your account'))
        }
      }
      setConnecting(false);
      setPrevWalletName(key);
    },


    // async ({ key, connectorId }: WalletDetail) => {

    //   // const connector = connectorsByName[connectorId];
    //   const findConnector = connectors.find((c) => c.id === connectorId)

    //   const isInjected = connectorId === ConnectorNames.Injected;  //only trust wallet use the injected
    //   setConnecting(true);

    //   await activate(connector, async (error) => {
    //     let errorMsg = "";
    //     if (error instanceof UnsupportedChainIdError) {
    //       //if is injected, need to setup the network
    //       if (isInjected) {
    //         const hasSetup = await setupNetwork();
    //         if (hasSetup) {
    //           await activate(connector);
    //         } else {
    //           errorMsg = "Please switch to Binance Smart Chain";
    //         }
    //       } else {
    //         errorMsg = "Please switch to Binance Smart Chain";
    //       }
    //     } else {
    //       // window.localStorage.removeItem(connectorLocalStorageKey)
    //       errorMsg = "Failed to connect wallet";
    //       if (
    //         error instanceof NoEthereumProviderError ||
    //         error instanceof NoBscProviderError
    //       ) {
    //         errorMsg = "No provider was found";
    //       } else if (error instanceof UserRejectedRequestErrorInjected) {
    //         errorMsg = "Please authorize to access your account";
    //       } else {
    //         if (error.message.indexOf("Binance-Chain-Tigris") > -1) {
    //           errorMsg = "Please switch to Binance Smart Chain";
    //         }
    //         console.log(error.name, error.message);
    //       }
    //     }
    //     if (errorMsg) {
    //       enqueueSnackbar(errorMsg, { variant: "error" });
    //     }
    //   });

    //   setConnecting(false);
    //   setPrevWalletName(key);
    // },







    [enqueueSnackbar, setPrevWalletName]
  );

  const logout = useCallback(async () => {
    try {
      await disconnectAsync()
    } catch (error) {
      console.error(error)
    } finally {
      // clearUserStates(dispatch, chain?.id, true)
    }
  }, [disconnectAsync, chain?.id])

  const shortAccount = useMemo(
    () => (address ? formatAddress(address) : ""),
    [address]
  );

  const watchAccount = useAtomValue(watchAccountAtom)
  const accountAddress = useMemo(() => {
    // return (account|| "")
    return watchAccount ? watchAccount : (address|| "")
  }, [address,watchAccount]);

  return {
    account: accountAddress,
    activate,
    chainId: chain?.id,
    deactivate: logout,
    connecting,
    connected: active,
    shortAccount,
    provider: library,
    ChainName,
    connectWallet,
  };
}

  // const address = useMemo(() => "0x8660684212F371F1834de5651F609af5D7F648F7" || "", [account]);
    // console.log("==walletinfo===",{
    //   account: account?.toLowerCase(),
    // activate:activate,
    // chainId:chainId,
    // deactivate:deactivate,
    // connecting:connecting,
    // shortAccount:shortAccount,
    // ChainName:ChainName,
    // })