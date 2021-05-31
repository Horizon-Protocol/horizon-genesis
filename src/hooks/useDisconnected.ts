import { useRef, useEffect } from "react";
import useWallet from "./useWallet";

export default function useDisconnected(callback: () => void) {
  const isInitialRef = useRef(true);

  const { account } = useWallet();

  useEffect(() => {
    if (!isInitialRef.current && !account) {
      callback();
    }
    isInitialRef.current = false;
  }, [account, callback]);
}
