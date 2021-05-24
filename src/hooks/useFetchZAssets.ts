import { useRequest } from "ahooks";
import { useUpdateAtom } from "jotai/utils";
import { BigNumber, utils } from "ethers";
import horizon from "@lib/horizon";
import { zAssetsBalanceAtom, zAssetstotalUSDAtom } from "@atoms/debt";
import { CurrencyKey, SynthBalancesMap } from "@utils/currencies";
import useWallet from "./useWallet";

type SynthBalancesTuple = [CurrencyKey[], BigNumber[], BigNumber[]];

export default function useFetchZAssets() {
  const { account } = useWallet();

  const setBalances = useUpdateAtom(zAssetsBalanceAtom);
  const setTotalUSD = useUpdateAtom(zAssetstotalUSDAtom);

  useRequest(
    async () => {
      const {
        contracts: { SynthUtil },
      } = horizon.js!;
      const balancesMap: SynthBalancesMap = {};
      const [currencyKeys, synthsBalances, synthsUSDBalances] =
        (await SynthUtil!.synthsBalances(account)) as SynthBalancesTuple;

      let totalUSDBalance = BigNumber.from(0);

      currencyKeys.forEach((currencyKey: string, idx: number) => {
        const balance = synthsBalances[idx];

        // discard empty balances
        if (balance.gt(0)) {
          const synthName = utils.parseBytes32String(
            currencyKey
          ) as CurrencyKey;
          const usdBalance = synthsUSDBalances[idx];

          balancesMap[synthName] = {
            currencyKey: synthName,
            balance,
            usdBalance,
          };

          totalUSDBalance = totalUSDBalance.add(usdBalance);
        }
      });

      return {
        totalUSDBalance,
        balancesMap,
      };
    },
    {
      ready: !!account && !!horizon.js,
      onSuccess({ balancesMap, totalUSDBalance }) {
        setBalances(balancesMap);
        setTotalUSD(totalUSDBalance);
      },
    }
  );
}
