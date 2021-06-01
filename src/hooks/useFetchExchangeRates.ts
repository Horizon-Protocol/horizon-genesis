import { useCallback } from "react";
import { useQuery, QueryFunction } from "react-query";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { utils, BigNumberish } from "ethers";
import { ratesAtom } from "@atoms/exchangeRates";
import horizon from "@lib/horizon";
import {
  Rates,
  CryptoCurrency,
  CurrencyKey,
  iStandardSynth,
  synthToAsset,
} from "@utils/currencies";
import { CONTRACT, PUBLIC } from "@utils/queryKeys";

type CurrencyRate = BigNumberish;
type SynthRatesTuple = [string[], CurrencyRate[]];

// Additional commonly used currencies to fetch, besides the one returned by the SynthUtil.synthsRates
const additionalCurrencies = [CryptoCurrency.HZN].map(
  utils.formatBytes32String
);

export default function useFetchExchangeRates() {
  const setRates = useUpdateAtom(ratesAtom);

  const fetcher = useCallback<QueryFunction<Rates, string[]>>(
    async ({ queryKey }) => {
      console.log("fetch", ...queryKey);
      const exchangeRates: Rates = {};
      const {
        contracts: { SynthUtil, ExchangeRates },
      } = horizon.js!;
      const [synthsRates, ratesForCurrencies] = (await Promise.all([
        SynthUtil.synthsRates(),
        ExchangeRates.ratesForCurrencies(additionalCurrencies),
      ])) as [SynthRatesTuple, CurrencyRate[]];

      const synths = [...synthsRates[0], ...additionalCurrencies] as string[];
      const rates = [
        ...synthsRates[1],
        ...ratesForCurrencies,
      ] as CurrencyRate[];

      synths.forEach((currencyKeyBytes32: CurrencyKey, idx: number) => {
        const currencyKey = utils.parseBytes32String(currencyKeyBytes32);
        const rate = Number(utils.formatEther(rates[idx]));
        exchangeRates[currencyKey] = rate;
        // only interested in the standard synths (zETH -> ETH, etc)
        if (iStandardSynth(currencyKey)) {
          exchangeRates[synthToAsset(currencyKey)] = rate;
        }
      });

      return exchangeRates;
    },
    []
  );

  useQuery([CONTRACT, PUBLIC, "exchangeRates"], fetcher, {
    onSuccess(rates) {
      // console.log(rates);
      setRates(rates);
    },
  });
}
