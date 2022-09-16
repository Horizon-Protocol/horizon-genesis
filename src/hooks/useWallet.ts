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
import { useConnect, useDisconnect, useNetwork,useAccount, ConnectorNotFoundError, UserRejectedRequestError, useSigner, useProvider } from 'wagmi'
import { ChainId } from "@utils/constants";

export default function useWallet() {
  const { enqueueSnackbar } = useSnackbar();
  const setPrevWalletName = useUpdateAtom(prevWalletNameAtom);
    const { connectAsync, connectors } = useConnect()
    const { data: signer, isError, isLoading } = useSigner()
    const { chain } = useNetwork()
    const { disconnectAsync } = useDisconnect()
    const { address, connector, isConnected, isConnecting} = useAccount()
    const provider = useProvider()
    const [connecting, setConnecting] = useState(false);
    const connectWallet = useCallback(

    async ({ key, connectorId }: WalletDetail) => {
      const findConnector = connectors.find((c) => c.id === connectorId)
      console.log('connectors',connectors)
      console.log('keyinfo',{key,connectorId,findConnector})
      try {
        const connected = await connectAsync({ connector: findConnector, chainId: ChainId })
        if (!connected.chain.unsupported && connected.chain.id !== ChainId) {
          alert('error chain unsupported')
        }
      } catch (error) {
        console.error(error)
        if (error instanceof ConnectorNotFoundError) {
          alert('error ConnectorNotFoundError')
          return
        }
        if (error instanceof UserRejectedRequestError) {
          alert('error UserRejectedRequestError')
          return
        }
        if (error instanceof Error) {
          // alert('already connected'+error.message)
        }
      }
      setConnecting(false);
      setPrevWalletName(key);
    },
    [enqueueSnackbar, setPrevWalletName]
  );

  const logout = useCallback(async () => {
    try {
      await disconnectAsync()
    } catch (error) {
      console.error(error)
    } finally {

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
    // activate,
    chainId: chain?.id,
    deactivate: logout,
    connecting,
    connected: isConnected,
    shortAccount,
    provider: provider,
    signer: signer,
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