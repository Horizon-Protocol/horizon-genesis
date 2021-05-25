import { useRequest } from "ahooks";
import { useUpdateAtom } from "jotai/utils";
import { utils } from "ethers";
import horizon from "@lib/horizon";
import { zAssetsBalanceAtom, zAssetstotalUSDAtom } from "@atoms/debt";
import { toBigNumber } from "@utils/number";
import { CurrencyKey, SynthBalancesMap } from "@utils/currencies";
import useWallet from "./useWallet";

type SynthBalancesTuple = [CurrencyKey[], number[], number[]];

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
    {
      ready: !!account && !!horizon.js,
      onSuccess({ balancesMap, totalUSDBalance }) {
        setBalances(balancesMap);
        setTotalUSD(totalUSDBalance);
      },
    }
  );
}
