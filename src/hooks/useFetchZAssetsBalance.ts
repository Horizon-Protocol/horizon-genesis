import { useQuery } from "react-query";
import { useResetAtom, useUpdateAtom } from "jotai/utils";
import { BigNumber, ethers } from "ethers";
import erc20Abi from "@contracts/abis/Erc20.json";
import useWallet from "@hooks/useWallet";
import { toBN, zeroBN } from "@utils/number";
import { zAssetsBalanceAtom, ZAssetsBalance, zUSDBalanceAtom, zAssetsBalanceInfoAtom } from "@atoms/balances";
import useDisconnected from "@hooks/useDisconnected";
import useHorizonJs from "@hooks/useHorizonJs";
import { WALLET } from "@utils/queryKeys";

export default function useFetchZAssetsBalance() {
  const { provider, account } = useWallet();
  const horizonJs = useHorizonJs();

  const setzAssetBalances = useUpdateAtom(zAssetsBalanceAtom);
  const setZUSDBalances = useUpdateAtom(zUSDBalanceAtom);

  const resetBalances = useResetAtom(zAssetsBalanceAtom);
  useDisconnected(resetBalances);

  const resetZUSDBalances = useResetAtom(zUSDBalanceAtom);
  useDisconnected(resetZUSDBalances);

  const resetZAssetsBlanceInfos = useResetAtom(zAssetsBalanceInfoAtom)
  useDisconnected(resetZAssetsBlanceInfos);

  //=========== generate balance extra infomation ===============
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

      return data.reduce((acc: ZAssetsBalance, { amount, token }) => {
        //去除没有值的zAsset
        if (amount.lte(0)) return acc;
        acc[token.symbol as CurrencyKey] = amount;
        return acc;
      }, {});
    },
    {
      enabled: !!provider && !!horizonJs && !!account,
      onSuccess(balances) {
        console.log('===useFetchZAssetsBalance', balances);
        setZUSDBalances(balances["zUSD"] || zeroBN)
        setzAssetBalances(balances);
      },
    }
  );
}
