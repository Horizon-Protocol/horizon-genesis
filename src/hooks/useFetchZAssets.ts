import { useCallback } from "react";
import { useQuery, QueryFunction } from "react-query";
import { useResetAtom, useUpdateAtom } from "jotai/utils";
import { utils } from "ethers";
import horizon from "@lib/horizon";
import {
  zAssetsBalanceAtom,
  zAssetstotalUSDAtom,
  resetZAssetsAtom,
} from "@atoms/debt";
import { toBigNumber } from "@utils/number";
import { CurrencyKey, SynthBalancesMap } from "@utils/currencies";
import { CONTRACT, USER } from "@utils/queryKeys";
import useWallet from "./useWallet";
import useDisconnected from "./useDisconnected";

type SynthBalancesTuple = [CurrencyKey[], number[], number[]];

export default function useFetchZAssets() {
  const { account } = useWallet();

  const setBalances = useUpdateAtom(zAssetsBalanceAtom);
  const setTotalUSD = useUpdateAtom(zAssetstotalUSDAtom);

  const resetZAssets = useResetAtom(resetZAssetsAtom);

  useDisconnected(resetZAssets);

  const fetcher = useCallback<
    QueryFunction<
      {
        totalUSDBalance: BN;
        balancesMap: SynthBalancesMap;
      },
      string[]
    >
  >(
    async ({ queryKey }) => {
      console.log("fetch", ...queryKey);
      const {
        contracts: { SynthUtil },
      } = horizon.js!;
      const balancesMap: SynthBalancesMap = {};
      const [currencyKeys, synthsBalances, synthsUSDBalances] =
        (await SynthUtil!.synthsBalances(account)) as SynthBalancesTuple;

      let totalUSDBalance = toBigNumber(0);

      currencyKeys.forEach((currencyKey: string, idx: number) => {
        const balance = toBigNumber(utils.formatEther(synthsBalances[idx]));

        // discard empty balances
        if (balance.gt(0)) {
          const synthName = utils.parseBytes32String(
            currencyKey
          ) as CurrencyKey;
          const usdBalance = toBigNumber(
            utils.formatEther(synthsUSDBalances[idx])
          );

          balancesMap[synthName] = {
            currencyKey: synthName,
            balance,
            usdBalance,
          };

          totalUSDBalance = totalUSDBalance.plus(usdBalance);
        }
      });

      return {
        totalUSDBalance,
        balancesMap,
      };
    },
    [account]
  );

  useQuery([CONTRACT, USER, "zAssets"], fetcher, {
    enabled: !!account && !!horizon.js,
    onSuccess({ balancesMap, totalUSDBalance }) {
      setBalances(balancesMap);
      setTotalUSD(totalUSDBalance);
    },
  });
}
