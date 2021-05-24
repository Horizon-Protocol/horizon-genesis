import { useRequest } from "ahooks";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { BigNumber } from "@ethersproject/bignumber";
import {
  readyAtom,
  totalSupplyAtom,
  targetCRatioAtom,
  liquidationRatioAtom,
  liquidationDelayAtom,
} from "@atoms/app";
import horizon from "@lib/horizon";
import useFetchExchangeRates from "./useFetchExchangeRates";

export default function useFetchAppData() {
  const appReady = useAtomValue(readyAtom);

  const setTotalSupply = useUpdateAtom(totalSupplyAtom);
  const setTargetCRatio = useUpdateAtom(targetCRatioAtom);
  const setLiquidationRatio = useUpdateAtom(liquidationRatioAtom);
  const setLiquidationDelay = useUpdateAtom(liquidationDelayAtom);

  useRequest(
    async () => {
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
      ready: appReady && !!horizon.js,
      onSuccess([
        totalSupply,
        targetCRatio,
        liquidationRatio,
        liquidationDelay,
      ]) {
        // console.log({
        //   totalSupply,
        //   targetCRatio,
        //   liquidationRatio: liquidationRatio.toString(),
        //   liquidationDelay: liquidationDelay.toString(),
        // });
        setTotalSupply(totalSupply);
        setTargetCRatio(targetCRatio);
        setLiquidationRatio(liquidationRatio);
        setLiquidationDelay(liquidationDelay);
      },
    }
  );

  useFetchExchangeRates();
}
