import { useRequest } from "ahooks";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { utils } from "ethers";
import {
  balanceChangedAtom,
  needRefreshAtom,
  totalSupplyAtom,
  targetCRatioAtom,
  liquidationRatioAtom,
  // liquidationDelayAtom,
} from "@atoms/app";
import horizon from "@lib/horizon";
import useFetchExchangeRates from "./useFetchExchangeRates";
import { toBigNumber } from "@utils/number";

export default function useFetchAppData() {
  const needRefresh = useAtomValue(needRefreshAtom);
  const setBalanceChanged = useUpdateAtom(balanceChangedAtom);

  const setTotalSupply = useUpdateAtom(totalSupplyAtom);
  const setTargetCRatio = useUpdateAtom(targetCRatioAtom);
  const setLiquidationRatio = useUpdateAtom(liquidationRatioAtom);
  // const setLiquidationDelay = useUpdateAtom(liquidationDelayAtom);

  useRequest(
    async () => {
      console.log("load app state");
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
      ready: needRefresh && !!horizon.js,
      refreshDeps: [needRefresh],
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
        setBalanceChanged(false);
      },
    }
  );

  useFetchExchangeRates();
}
