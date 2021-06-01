import { useCallback } from "react";
import { useQuery, QueryFunction } from "react-query";
import { useUpdateAtom } from "jotai/utils";
import {
  totalSupplyAtom,
  totalIssuedZUSDExclEthAtom,
  targetCRatioAtom,
  liquidationRatioAtom,
  // liquidationDelayAtom,
} from "@atoms/app";
import horizon from "@lib/horizon";
import useFetchExchangeRates from "./useFetchExchangeRates";
import { toBigNumber } from "@utils/number";
import { CONTRACT, PUBLIC } from "@utils/queryKeys";

export default function useFetchAppData() {
  const setTotalSupply = useUpdateAtom(totalSupplyAtom);
  const setTotalIssuedZUSDExclEth = useUpdateAtom(totalIssuedZUSDExclEthAtom);
  const setTargetCRatio = useUpdateAtom(targetCRatioAtom);
  const setLiquidationRatio = useUpdateAtom(liquidationRatioAtom);
  // const setLiquidationDelay = useUpdateAtom(liquidationDelayAtom);

  const fetcher = useCallback<QueryFunction<BN[], string[]>>(
    async ({ queryKey }) => {
      console.log("fetch", ...queryKey);
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

  useQuery([CONTRACT, PUBLIC, "app"], fetcher, {
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
    },
  });

  useFetchExchangeRates();
}
