import { useQuery } from "react-query";
import { useResetAtom, useUpdateAtom } from "jotai/utils";
import { BigNumber, ethers } from "ethers";
import erc20Abi from "@abis/erc20.json";
import useWallet from "@hooks/useWallet";
import { toBN, zeroBN } from "@utils/number";
import { zAssetsBalanceAtom, ZAssetsBalance, zUSDBalanceAtom } from "@atoms/balances";
import useDisconnected from "@hooks/useDisconnected";
import useHorizonJs from "@hooks/useHorizonJs";
import { WALLET } from "@utils/queryKeys";
import { formatNumber } from "@utils/number";

export default function useTokensBalance() {
  const { provider, account } = useWallet();
  const horizonJs = useHorizonJs();
  const setBalances = useUpdateAtom(zAssetsBalanceAtom);
  const setZUSDBalances = useUpdateAtom(zUSDBalanceAtom);

  const resetBalances = useResetAtom(zAssetsBalanceAtom);
  useDisconnected(resetBalances);

  const resetZUSDBalances = useResetAtom(zUSDBalanceAtom);
  useDisconnected(resetZUSDBalances);

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

      console.log('==========tokens=========',tokens)

      const promises = tokens.map(async (token) => {
        // console.log('============token===========', token)
        // address: "0xd582733b8CE3b84fcfad9373626C89C7d5606e30"
        // asset: "HZN"
        // decimals: 18
        // feed: "0x8D9a3c662f5cAD6F0221a0C1760875350bb1c279"
        // name: "Synthetix"
        // symbol: "HZN"
        if (!provider || !account) return { amount: toBN(0), token };
        const balance = await getBalance(token);
        // console.log('============tokenbalance===========', balance)
        // BigNumber {_hex: '0x69e10de76676d0800000', _isBigNumber: true}
        return {
          amount: toBN(ethers.utils.formatUnits(balance, token.decimals)),
          token,
        };
      });

      const data = await Promise.all(promises);
      // console.log('================ZAssetsBalance===========', data);
      // (7) [{…}, {…}, {…}, {…}, {…}, {…}, {…}]
      // amount: BigNumber2 {s: 1, e: 5, c: Array(1)}
      // token: {symbol: 'HZN', asset: 'HZN', name: 'Synthetix', address: '0xd582733b8CE3b84fcfad9373626C89C7d5606e30', decimals: 18, …}
      // [[Prototype]]: Object
      // 1: {amount: BigNumber2, token: {…}}
      // 2: {amount: BigNumber2, token: {…}}
      return data.reduce((acc: ZAssetsBalance, { amount, token }, index, arr) => {
        // console.log('================ZAssetsBalancereduce===========', {acc:acc, amount:formatNumber(amount), token:token});
        //去除没有值的zAsset
        if (amount.lte(0)) return acc;
        // console.log('================ZAssetsBalancereduce===========', {acc:acc, amount:formatNumber(amount), token:token});
        acc[token.symbol as CurrencyKey] = amount;
        return acc;
      }, {});
    },
    {
      enabled: !!provider && !!horizonJs && !!account,
      onSuccess(balances) {
        console.log('================balances===========', balances);
        // {HZN: BigNumber2, zUSD: BigNumber2}
        setZUSDBalances(balances["zUSD"] || zeroBN)
        setBalances(balances);
      },
    }
  );
}
