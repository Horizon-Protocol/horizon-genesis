import { useRequest } from "ahooks";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { utils } from "ethers";
import {
  readyAtom,
  totalSupplyAtom,
  targetCRatioAtom,
  liquidationRatioAtom,
  // liquidationDelayAtom,
} from "@atoms/app";
import horizon from "@lib/horizon";
import useFetchExchangeRates from "./useFetchExchangeRates";
import { toBigNumber } from "@utils/number";

export default function useFetchAppData() {
  const appReady = useAtomValue(readyAtom);

  const setTotalSupply = useUpdateAtom(totalSupplyAtom);
  const setTargetCRatio = useUpdateAtom(targetCRatioAtom);
  const setLiquidationRatio = useUpdateAtom(liquidationRatioAtom);
  // const setLiquidationDelay = useUpdateAtom(liquidationDelayAtom);

  useRequest(
    async () => {
      const {
        contracts: { SystemSettings, Synthetix, Liquidations },
      } = horizon.js!;
      const res = await Promise.all([
        Synthetix.totalSupply(),
        SystemSettings.issuanceRatio(),
        Liquidations.liquidationRatio(),
        // Liquidations.liquidationDelay(),
      ]);
      return res.map((item) => toBigNumber(utils.formatEther(item)));
    },
    {
      ready: appReady && !!horizon.js,
      onSuccess([
        totalSupply,
        targetCRatio,
        liquidationRatio,
        // liquidationDelay,
      ]) {
        console.log({
          totalSupply,
          targetCRatio,
          liquidationRatio: liquidationRatio,
          // liquidationDelay: liquidationDelay,
        });
        setTotalSupply(totalSupply);
        setTargetCRatio(targetCRatio);
        setLiquidationRatio(liquidationRatio);
        // setLiquidationDelay(liquidationDelay);
      },
    }
  );

  useFetchExchangeRates();
}
