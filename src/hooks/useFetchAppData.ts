import { useEffect, useState } from "react";
import { useRequest } from "ahooks";
import { useUpdateAtom } from "jotai/utils";
import { BigNumber } from "@ethersproject/bignumber";
import {
  totalSupplyAtom,
  targetCRatioAtom,
  liquidationRatioAtom,
  liquidationDelayAtom,
} from "@atoms/app";
import horizon from "@lib/horizon";
import { ChainId } from "@utils/constants";
import useRpcProvider from "./useRpcProvider";

export default function useFetchAppData() {
  const [ready, setReady] = useState(false);
  const rpcProvider = useRpcProvider();

  useEffect(() => {
    if (rpcProvider && !horizon.js) {
      horizon.setContractSettings({
        networkId: ChainId,
        provider: rpcProvider,
      });
      setReady(true);
    }
  }, [rpcProvider]);

  const setTotalSupply = useUpdateAtom(totalSupplyAtom);
  const setTargetCRatio = useUpdateAtom(targetCRatioAtom);
  const setLiquidationRatio = useUpdateAtom(liquidationRatioAtom);
  const setLiquidationDelay = useUpdateAtom(liquidationDelayAtom);

  useRequest(
    async () => {
      console.log("fetch!!!!!");
      const {
        contracts: { SystemSettings, Synthetix, Liquidations },
      } = horizon.js!;
      const res: BigNumber[] = await Promise.all([
        Synthetix.totalSupply(),
        SystemSettings.issuanceRatio(),
        Liquidations.liquidationRatio(),
        Liquidations.liquidationDelay(),
      ]);
      return res;
    },
    {
      ready: ready && !!horizon.js,
      onSuccess([
        totalSupply,
        targetCRatio,
        liquidationRatio,
        liquidationDelay,
      ]) {
        console.log({
          totalSupply,
          targetCRatio,
          liquidationRatio: liquidationRatio.toString(),
          liquidationDelay: liquidationDelay.toString(),
        });
        setTotalSupply(totalSupply);
        setTargetCRatio(targetCRatio);
        setLiquidationRatio(liquidationRatio);
        setLiquidationDelay(liquidationDelay);
      },
    }
  );
}
