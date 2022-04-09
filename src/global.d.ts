declare namespace NodeJS {
  interface ProcessEnv {}
}

interface Window {
  horizon: any;
  ethereum?: {
    isMetaMask?: true;
    request?: (...args: any[]) => void;
  };
}
