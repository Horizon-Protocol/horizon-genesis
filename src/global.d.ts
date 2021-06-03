declare namespace NodeJS {
  interface ProcessEnv {}
}

interface WindowChain {
  ethereum?: {
    isMetaMask?: true;
    request?: (...args: any[]) => void;
  };
}
