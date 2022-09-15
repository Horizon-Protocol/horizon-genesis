// import { BinanceWalletConnector } from '@pancakeswap/wagmi/connectors/binanceWallet'
// import { bsc, bscTest, goerli, rinkeby } from '@pancakeswap/wagmi/chains'
import { configureChains, createClient } from 'wagmi'
import memoize from 'lodash/memoize'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { bsc, bscTest } from './chains'
import { BinanceWalletConnector } from './binanceWallet'
import { SafeConnector } from '@gnosis.pm/safe-apps-wagmi'
import useRpcProvider from '@hooks/useRpcProvider'
import { useEffect } from 'react'

const CHAINS = [
  bsc,
  // TODO: ETH
  // mainnet,
  bscTest,
  // rinkeby,
  // goerli,
]

// const getNodeRealUrl = (networkName: string) => {
//   let host = null
//   switch (networkName) {
//     case 'homestead':
//       if (process.env.NEXT_PUBLIC_NODE_REAL_API_ETH) {
//         host = `eth-mainnet.nodereal.io/v1/${process.env.NEXT_PUBLIC_NODE_REAL_API_ETH}`
//       }
//       break
//     case 'rinkeby':
//       if (process.env.NEXT_PUBLIC_NODE_REAL_API_RINKEBY) {
//         host = `eth-rinkeby.nodereal.io/v1/${process.env.NEXT_PUBLIC_NODE_REAL_API_RINKEBY}`
//       }
//       break
//     case 'goerli':
//       if (process.env.NEXT_PUBLIC_NODE_REAL_API_GOERLI) {
//         host = `eth-goerli.nodereal.io/v1/${process.env.NEXT_PUBLIC_NODE_REAL_API_GOERLI}`
//       }
//       break
//     default:
//       host = null
//   }

//   if (!host) {
//     return null
//   }

//   const url = `https://${host}`
//   return {
//     http: url,
//     webSocket: url.replace(/^http/i, 'wss').replace('.nodereal.io/v1', '.nodereal.io/ws/v1'),
//   }
// }

// const rpcProvider = useRpcProvider();

export const { provider, chains } = configureChains(CHAINS, [
  jsonRpcProvider({
    rpc: (chain) => {
      return { http: chain.rpcUrls.default }
    },
  }),
])


// useEffect(()=>{
  console.log('=====provider',provider)
  console.log('=====chains',chains)

// },[provider])

export const injectedConnector = new InjectedConnector({
  chains,
  options: {
    shimDisconnect: false,
    shimChainChangedDisconnect: true,
  },
})

// export const coinbaseConnector = new CoinbaseWalletConnector({
//   chains,
//   options: {
//     appName: 'PancakeSwap',
//     appLogoUrl: 'https://pancakeswap.com/logo.png',
//   },
// })

export const walletConnectConnector = new WalletConnectConnector({
  chains,
  options: {
    qrcode: true,
  },
})

export const metaMaskConnector = new MetaMaskConnector({
  chains,
  options: {
    shimDisconnect: false,
    shimChainChangedDisconnect: true,
  },
})

// export const bscConnector = new BinanceWalletConnector({ chains })

export const client = createClient({
  autoConnect: false,
  provider,
  connectors: [
    new SafeConnector({ chains }),
    metaMaskConnector,
    injectedConnector,
    // coinbaseConnector,
    walletConnectConnector,
    // bscConnector,
  ],
})

export const CHAIN_IDS = chains.map((c) => c.id)

export const isChainSupported = memoize((chainId: number) => CHAIN_IDS.includes(chainId))
export const isChainTestnet = memoize((chainId: number) => chains.find((c) => c.id === chainId)?.testnet)
