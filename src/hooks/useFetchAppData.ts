import { useCallback } from "react";
import { useQuery, QueryFunction } from "react-query";
import { useUpdateAtom } from "jotai/utils";
import {
  totalSupplyAtom,
  totalIssuedZUSDExclEthAtom,
  targetRatioAtom,
  liquidationRatioAtom,
  // liquidationDelayAtom,
} from "@atoms/app";
import horizon from "@lib/horizon";
import useFetchExchangeRates from "./useFetchExchangeRates";
import { etherToBN } from "@utils/number";
import { CONTRACT, PUBLIC } from "@utils/queryKeys";

export default function useFetchAppData() {
  const setTotalSupply = useUpdateAtom(totalSupplyAtom);
  const setTotalIssuedZUSDExclEth = useUpdateAtom(totalIssuedZUSDExclEthAtom);
  const setTargetCRatio = useUpdateAtom(targetRatioAtom);
  const setLiquidationRatio = useUpdateAtom(liquidationRatioAtom);
  // const setLiquidationDelay = useUpdateAtom(liquidationDelayAtom);

  const fetcher = useCallback<QueryFunction<BN[], string[]>>(
    async ({ queryKey }) => {
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
      return res.map((item) => etherToBN(item));
    },
    []
  );

  useQuery([CONTRACT, PUBLIC, "app"], fetcher, {
    onSuccess([
      totalSupply,
      totalIssuedZUSDExclEth,
      targetRatio,
      liquidationRatio,
      // liquidationDelay,
    ]) {
      // console.log({
      //   totalIssuedZUSDExclEth: totalIssuedZUSDExclEth.toString(),
      //   // liquidationDelay: liquidationDelay,
      // });
      setTotalSupply(totalSupply);
      setTotalIssuedZUSDExclEth(totalIssuedZUSDExclEth);
      setTargetCRatio(targetRatio);
      setLiquidationRatio(liquidationRatio);
      // setLiquidationDelay(liquidationDelay);
    },
  });

  useFetchExchangeRates();
}
