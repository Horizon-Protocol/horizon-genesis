import { useCallback } from "react";
import { useQuery, QueryFunction } from "react-query";
import { useResetAtom, useUpdateAtom } from "jotai/utils";
import { ethers, utils } from "ethers";
import horizon from "@lib/horizon";
import {
  // zAssetsBalanceAtom,
  // resetZAssetsAtom,
} from "@atoms/debt";
import { etherToBN, zeroBN } from "@utils/number";
import { SynthBalancesMap } from "@utils/currencies";
import { CONTRACT } from "@utils/queryKeys";
import useWallet from "./useWallet";
import useDisconnected from "./useDisconnected";

type SynthBalancesTuple = [
  CurrencyKey[],
  ethers.BigNumber[],
  ethers.BigNumber[]
];

export default function useFetchZAssets() {
  const { account } = useWallet();

  // const setBalances = useUpdateAtom(zAssetsBalanceAtom);
// 
  // const resetZAssets = useResetAtom(resetZAssetsAtom);

  // useDisconnected(resetZAssets);

  const fetcher = useCallback<
    QueryFunction<
      {
        // balancesMap: SynthBalancesMap;
      },
      string[]
    >
  >(async () => {
    const {
      contracts: { SynthUtil },
    } = horizon.js!;
    // const balancesMap: SynthBalancesMap = {};
    const [currencyKeys, synthsBalances, synthsUSDBalances] =
      (await SynthUtil!.synthsBalances(account)) as SynthBalancesTuple;

    let totalUSDBalance = zeroBN;

    currencyKeys.forEach((currencyKey: string, idx: number) => {
      const balance = etherToBN(synthsBalances[idx]);

      // discard empty balances
      if (balance.gt(0)) {
        const synthName = utils.parseBytes32String(currencyKey) as CurrencyKey;
        const usdBalance = etherToBN(synthsUSDBalances[idx]);

        // balancesMap[synthName] = {
        //   currencyKey: synthName,
        //   balance,
        //   usdBalance,
        // };
      }
    });

    return {
      // balancesMap,
    };
  }, [account]);

  useQuery([CONTRACT, account, "zAssets"], fetcher, {
    enabled: !!account && !!horizon.js,
    onSuccess({  }) {
      // setBalances(balancesMap);
    },
  });
}
