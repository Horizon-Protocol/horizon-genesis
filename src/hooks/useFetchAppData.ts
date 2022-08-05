import { useCallback } from "react";
import { useQuery, QueryFunction } from "react-query";
import { useUpdateAtom } from "jotai/utils";
import {
  appDataReadyAtom,
  lastDebtLedgerEntryAtom,
  totalSupplyAtom,
  totalIssuedZUSDExclEthAtom,
  targetRatioAtom,
  liquidationRatioAtom,
  // liquidationDelayAtom,
} from "@atoms/app";
import horizon from "@lib/horizon";
import useFetchExchangeRates from "./useFetchExchangeRates";
import { etherToBN, toBN } from "@utils/number";
import { CONTRACT, PUBLIC } from "@utils/queryKeys";

export default function useFetchAppData() {
  const setAppDataReady = useUpdateAtom(appDataReadyAtom);

  const setLastDebtLedgerEntry = useUpdateAtom(lastDebtLedgerEntryAtom);
  const setTotalSupply = useUpdateAtom(totalSupplyAtom);
  const setTotalIssuedZUSDExclEth = useUpdateAtom(totalIssuedZUSDExclEthAtom);
  const setTargetCRatio = useUpdateAtom(targetRatioAtom);
  const setLiquidationRatio = useUpdateAtom(liquidationRatioAtom);
  // const setLiquidationDelay = useUpdateAtom(liquidationDelayAtom);

  const fetcher = useCallback<QueryFunction<BN[], string[]>>(async () => {
    const {
      contracts: { SystemSettings, Synthetix, SynthetixState, Liquidations },
      utils,
    } = horizon.js!;
    const res = await Promise.all([
      SynthetixState.lastDebtLedgerEntry(),
      Synthetix.totalSupply(),
      Synthetix.totalIssuedSynthsExcludeOtherCollateral(
        utils.formatBytes32String("zUSD"),
        {
          blockTag: "latest",
        }
      ),
      SystemSettings.issuanceRatio(),
      Liquidations.liquidationRatio(),
      // Liquidations.liquidationDelay(),
    ]);

    return [
      toBN(utils.formatUnits(res[0], 27)),
      ...res.slice(1).map((val) => etherToBN(val)),
    ];
  }, []);

  useQuery([CONTRACT, PUBLIC, "app"], fetcher, {
    onSuccess([
      lastDebtLedgerEntry,
      totalSupply,
      totalIssuedZUSDExclEth,
      targetRatio,
      liquidationRatio,
      // liquidationDelay,
    ]) {
      console.log("====useFetchAppData====", {
        lastDebtLedgerEntry: lastDebtLedgerEntry.toString(),
        totalSupply: totalSupply.toString(),
        totalIssuedZUSDExclEth: totalIssuedZUSDExclEth.toString(),
        targetRatio: targetRatio.toString(),
        liquidationRatio: liquidationRatio.toString(),
        // liquidationDelay: liquidationDelay,
      });
      setLastDebtLedgerEntry(lastDebtLedgerEntry);
      setTotalSupply(totalSupply);
      setTotalIssuedZUSDExclEth(totalIssuedZUSDExclEth);
      setTargetCRatio(targetRatio);
      // setTargetCRatio(toBN(0.05));
      setLiquidationRatio(liquidationRatio);
      // setLiquidationDelay(liquidationDelay);

      setAppDataReady(true);
    },
  });

  useFetchExchangeRates();
}
