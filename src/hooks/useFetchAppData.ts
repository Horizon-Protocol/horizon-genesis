import { useCallback } from "react";
import { useQuery, QueryFunction } from "react-query";
import { useUpdateAtom } from "jotai/utils";
import {
  totalIssuedZUSDExclEthAtom,
} from "@atoms/app";
import horizon from "@lib/horizon";
import useFetchExchangeRates from "./useFetchExchangeRates";
import { etherToBN, toBN } from "@utils/number";
import { CONTRACT, PUBLIC } from "@utils/queryKeys";

export default function useFetchAppData() {
  const setTotalIssuedZUSDExclEth = useUpdateAtom(totalIssuedZUSDExclEthAtom);

  const fetcher = useCallback<QueryFunction<BN[], string[]>>(async () => {
    const {
      contracts: { SystemSettings, Synthetix, SynthetixState, Liquidations },
      utils,
    } = horizon.js!;
    const res = await Promise.all([
      Synthetix.totalIssuedSynthsExcludeOtherCollateral(
        utils.formatBytes32String("zUSD"),
        {
          blockTag: "latest",
        }
      ),
    ]);

    return [
      etherToBN(res[0])
    ];
  }, []);

  useQuery([CONTRACT, PUBLIC, "app"], fetcher, {
    onSuccess([
      totalIssuedZUSDExclEth,
    ]) {
      console.log("====SingleAppData====", {
        totalIssuedZUSDExclEth: totalIssuedZUSDExclEth.toString(),
    });
      setTotalIssuedZUSDExclEth(totalIssuedZUSDExclEth);
    },
  });

  useFetchExchangeRates();
}
