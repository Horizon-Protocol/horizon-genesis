import { useQuery } from "react-query";
import { useAtomValue, useResetAtom, useUpdateAtom } from "jotai/utils";
import { BigNumber, ethers } from "ethers";
import erc20Abi from "@abis/erc20.json";
import useWallet from "@hooks/useWallet";
import { toBN, zeroBN } from "@utils/number";
import { zAssetsBalanceAtom, ZAssetsBalance, zUSDBalanceAtom, zAssetsBalanceInfoAtom } from "@atoms/balances";
import useDisconnected from "@hooks/useDisconnected";
import useHorizonJs from "@hooks/useHorizonJs";
import { WALLET } from "@utils/queryKeys";
import { formatNumber } from "@utils/number";
import { ratesAtom } from "@atoms/exchangeRates";
import { useMemo } from "react";
import horizon from "@lib/horizon";
import { sumBy, values } from "lodash";

export default function useFetchZAssetsBalance() {
  const { provider, account } = useWallet();
  const horizonJs = useHorizonJs();

  const setzAssetBalances = useUpdateAtom(zAssetsBalanceAtom);
  const setZUSDBalances = useUpdateAtom(zUSDBalanceAtom);
  const setZAssetsBalanceInfo = useUpdateAtom(zAssetsBalanceInfoAtom);

  const resetBalances = useResetAtom(zAssetsBalanceAtom);
  useDisconnected(resetBalances);

  const resetZUSDBalances = useResetAtom(zUSDBalanceAtom);
  useDisconnected(resetZUSDBalances);

  const resetZAssetsBlanceInfos = useResetAtom(zAssetsBalanceInfoAtom)
  useDisconnected(resetZAssetsBlanceInfos);

  //=========== generate balance extra infomation ===============
  const zAssetsBalance = useAtomValue(zAssetsBalanceAtom)
  const rates = useAtomValue(ratesAtom);
  const zAssets = values(horizon.synthsMap) || [];

  const othersZAssetsBalance = useMemo(()=>{
    const noZeroZAssets = zAssets.filter(({name}) => zAssetsBalance[name]?.gt(0) && rates[name])
    .map((item, index) => {
      return {
        ...item,
        id: item.name,
        amount: zAssetsBalance[item.name]!.toNumber(),
        amountUSD: zAssetsBalance[item.name]!.multipliedBy(
          rates[item.name]!
        ).toNumber(),
      }
    })
    const totalUSD = sumBy(noZeroZAssets, "amountUSD");
    const fulInfoZAssetBalance = noZeroZAssets.map((item,index) => {
      return {
        ...item,
        percent: item.amountUSD / totalUSD,
      }
    })
    console.log("========fulInfoZAssetBalance======",fulInfoZAssetBalance)
    console.log("========rates======",rates)

    setZAssetsBalanceInfo(fulInfoZAssetBalance)
  },[zAssetsBalance,rates])

  useQuery<ZAssetsBalance>(
    [WALLET, account, "balances"],
    async () => {
      const { tokens } = horizonJs!;
     
      const getBalance = ({
        address,
        symbol,
      }: Token): Promise<BigNumber> => {
        if (!provider || !account) {
          return Promise.resolve(BigNumber.from(0));
        }
        if (symbol === "BNB") {
          return provider.getBalance(account);
        } else {
          const tokenContract = new ethers.Contract(
            address,
            erc20Abi,
            provider
          );
          return tokenContract.balanceOf(account);
        }
      };

      // console.log('==========tokens=========',tokens)
      const promises = tokens.map(async (token) => {
        if (!provider || !account) return { amount: toBN(0), token };
        const balance = await getBalance(token);
        return {
          amount: toBN(ethers.utils.formatUnits(balance, token.decimals)),
          token,
        };
      });

      const data = await Promise.all(promises);

      return data.reduce((acc: ZAssetsBalance, { amount, token }, index, arr) => {
        //去除没有值的zAsset
        if (amount.lte(0)) return acc;
        acc[token.symbol as CurrencyKey] = amount;
        return acc;
      }, {});
    },
    {
      enabled: !!provider && !!horizonJs && !!account,
      onSuccess(balances) {
        // console.log('================balances===========', balances);
        setZUSDBalances(balances["zUSD"] || zeroBN)
        setzAssetBalances(balances);
      },
    }
  );
}
