declare namespace NodeJS {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface ProcessEnv {}
}

interface Window {
  horizon: any;
  ethereum?: {
    isMetaMask?: true;
    request?: (...args: any[]) => void;
  };
  BinanceChain?: {
    bnbSign?: (address: string, message: string) => Promise<{ publicKey: string; signature: string }>;
  };
}
