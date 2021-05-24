import { useRequest } from "ahooks";
import { useUpdateAtom } from "jotai/utils";
import { debtAtom } from "@atoms/debt";
import { BigNumber, utils } from "ethers";
import horizon from "@lib/horizon";
import { CurrencyKey, CryptoBalance } from "@utils/currencies";
import useWallet from "./useWallet";

export type SynthBalancesMap = Record<CurrencyKey, CryptoBalance>;

type SynthBalancesTuple = [CurrencyKey[], number[], number[]];

export default function useFetchZAssets() {
  const { account } = useWallet();

  const setDebtData = useUpdateAtom(debtAtom);

  useRequest(
    async () => {
      const {
        contracts: { SynthUtil },
      } = horizon.js!;
      const balancesMap: SynthBalancesMap = {};
      const [currencyKeys, synthsBalances, synthsUSDBalances] =
        (await SynthUtil!.synthsBalances(account)) as SynthBalancesTuple;

      let totalUSDBalance = BigNumber.from(0);

      console.log("synthsBalances", synthsBalances);
      currencyKeys.forEach((currencyKey: string, idx: number) => {
        const balance = BigNumber.from(utils.formatEther(synthsBalances[idx]));
        console.log("currencyKey", balance.toString());

        // discard empty balances
        if (balance.gt(0)) {
          const synthName = utils.parseBytes32String(
            currencyKey
          ) as CurrencyKey;
          const usdBalance = synthsUSDBalances[idx];

          // balancesMap[synthName] = {
          //   currencyKey: synthName,
          //   balance,
          //   usdBalance,
          // };

          totalUSDBalance = totalUSDBalance.add(usdBalance);
        }
      });

      console.log({
        totalUSDBalance: totalUSDBalance.toString(),
        balancesMap: balancesMap,
      });
    },
    {
      ready: !!account && !!horizon.js,
      onSuccess() {},
    }
  );
}
