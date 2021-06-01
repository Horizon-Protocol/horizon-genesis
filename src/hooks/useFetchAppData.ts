import { useCallback } from "react";
import { useQuery, QueryFunction } from "react-query";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import {
  balanceChangedAtom,
  needRefreshAtom,
  totalSupplyAtom,
  totalIssuedZUSDExclEthAtom,
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
  const setTotalIssuedZUSDExclEth = useUpdateAtom(totalIssuedZUSDExclEthAtom);
  const setTargetCRatio = useUpdateAtom(targetCRatioAtom);
  const setLiquidationRatio = useUpdateAtom(liquidationRatioAtom);
  // const setLiquidationDelay = useUpdateAtom(liquidationDelayAtom);

  const fetcher = useCallback<QueryFunction<BN[], [string, boolean]>>(
    async ({ queryKey }) => {
      console.log("fetch", queryKey[0]);
      const {
        contracts: { SystemSettings, Synthetix, Liquidations },
        utils,
      } = horizon.js!;
      const res = await Promise.all([
        Synthetix.totalSupply(),
        Synthetix.totalIssuedSynthsExcludeEtherCollateral(
          utils.formatBytes32String("zUSD"),
          {
            blockTag: "latest",
          }
        ),
        SystemSettings.issuanceRatio(),
        Liquidations.liquidationRatio(),
        // Liquidations.liquidationDelay(),
      ]);
      return res.map((item) => toBigNumber(utils.formatEther(item)));
    },
    []
  );

  useQuery(["app", needRefresh], fetcher, {
    onSuccess([
      totalSupply,
      totalIssuedZUSDExclEth,
      targetCRatio,
      liquidationRatio,
      // liquidationDelay,
    ]) {
      // console.log({
      //   totalIssuedZUSDExclEth: totalIssuedZUSDExclEth.toString(),
      //   // liquidationDelay: liquidationDelay,
      // });
      setTotalSupply(totalSupply);
      setTotalIssuedZUSDExclEth(totalIssuedZUSDExclEth);
      setTargetCRatio(targetCRatio);
      setLiquidationRatio(liquidationRatio);
      // setLiquidationDelay(liquidationDelay);
      setBalanceChanged(false);
    },
  });

  useFetchExchangeRates();
}
