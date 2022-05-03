import { useMemo } from "react";
import { useAtomValue } from "jotai/utils";
import { readyAtom } from "@atoms/app";
import horizon from "@lib/horizon";

export default function useAddresses() {
  const ready = useAtomValue(readyAtom);

  const addressMap = useMemo(() => {
    if (ready) {
      const { tokensMap } = horizon;
      return {
        HZN: tokensMap!.HZN!.address,
        zUSD: tokensMap!.zUSD!.address,
      };
    }
  }, [ready]);

  return addressMap;
}
