import { QueryFunction, useQuery } from "react-query";
import { useAtomValue, useResetAtom, useUpdateAtom } from "jotai/utils";
import { BigNumber, BigNumberish, ethers } from "ethers";
import erc20Abi from "@contracts/abis/Erc20.json";
import useWallet from "@hooks/useWallet";
import { toBN, zeroBN } from "@utils/number";
import { zAssetsBalanceAtom, ZAssetsBalance, zUSDBalanceAtom, zAssetsBalanceInfoAtom } from "@atoms/balances";
import useDisconnected from "@hooks/useDisconnected";
import useHorizonJs from "@hooks/useHorizonJs";
import { WALLET } from "@utils/queryKeys";
import { formatNumber } from "@utils/number";
import { ratesAtom } from "@atoms/exchangeRates";
import { useCallback, useMemo } from "react";
import horizon from "@lib/horizon";
import { sumBy, values } from "lodash";
import useGetEthCallProvider from "./staker/useGetEthCallProvider";
import { Call, Contract } from "@horizon-protocol/ethcall";

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
  const getProvider = useGetEthCallProvider();


  const zAssetsBalance = useAtomValue(zAssetsBalanceAtom)
  const rates = useAtomValue(ratesAtom);
  const zAssets = values(horizon.synthsMap) || [];

  const fetcher = useCallback(async () => {
    const { tokens, contracts } = horizonJs!;


    let zAssetsCalls: Call[] = []
    tokens.forEach(token => {
      const { address, symbol, name } = token

      if (!provider || !account) {
        return
      }

      const tokenContract = new Contract(
        address,
        erc20Abi,
      );
      zAssetsCalls.push(tokenContract.balanceOf(account))
    });

    const ethcallProvider = await getProvider();
    const data = (await ethcallProvider.all(zAssetsCalls)) as BigNumber[];

    return data.reduce((acc: ZAssetsBalance, amount, index, arr) => {
      const token = tokens[index]
      //去除没有值的zAsset
      if (amount.lte(0)) return acc;
      acc[token.symbol as CurrencyKey] = toBN(ethers.utils.formatUnits(amount, token.decimals));
      return acc;
    }, {});

  }, [horizonJs])

  useQuery<ZAssetsBalance>(
    [WALLET, account, "balances"],
    fetcher
    ,
    {
      enabled: !!provider && !!horizonJs && !!account,
      onSuccess(balances) {
        setZUSDBalances(balances["zUSD"] || zeroBN)
        setzAssetBalances(balances);
      },
    }
  );
}
