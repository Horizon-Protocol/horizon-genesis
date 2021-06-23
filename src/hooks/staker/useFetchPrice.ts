import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { fetchPrice } from "@apis/coingecko";
import { hznRateAtom } from "@atoms/exchangeRates";
import { tokenPriceAtomFamily } from "@atoms/staker/price";
import erc20Abi from "@abis/erc20.json";
import { Erc20 } from "@abis/types";
import { TokenAddresses, Token, StakingAddresses } from "@utils/constants";
import { etherToBN, zeroBN } from "@utils/number";
import { EARN, PUBLIC } from "@utils/queryKeys";
import { useRpcContract, useHZN } from "../useContract";

export default function useFetchPrice() {
  const [timestamp, setTimestamp] = useState<number>(0);
  const [hznInLp, setHZNInLp] = useState<BN>(zeroBN);
  const [lpTotalSupply, setLpTotalSupply] = useState<BN>(zeroBN);

  const hznRate = useAtomValue(hznRateAtom);

  const HZN = useHZN();

  const lpToken = useRpcContract(
    TokenAddresses[Token.HZN_BNB_LP],
    erc20Abi
  ) as Erc20;

  const setPHBPrice = useUpdateAtom(tokenPriceAtomFamily(Token.PHB));
  const setLpPrice = useUpdateAtom(tokenPriceAtomFamily(Token.HZN_BNB_LP));

  const fetcher = useCallback(async () => {
    if (!hznRate) {
      return;
    }
    const now = Date.now() / 1000;

    if (now - timestamp < 5) {
      return;
    }
    setTimestamp(now);
    const [{ phb }, hznInLp, lpTotalSupply] = await Promise.all([
      fetchPrice(),
      HZN?.balanceOf(StakingAddresses[Token.HZN_BNB_LP]),
      lpToken.totalSupply(),
    ]);

    const hznInLpBN = hznInLp ? etherToBN(hznInLp) : zeroBN;

    setPHBPrice(phb);
    setHZNInLp(hznInLpBN);
    setLpTotalSupply(etherToBN(lpTotalSupply));
  }, [HZN, hznRate, lpToken, setPHBPrice, timestamp]);

  useQuery([EARN, PUBLIC, "price"], fetcher);

  useEffect(() => {
    const overallValueOfLPToken = hznInLp.multipliedBy(2).multipliedBy(hznRate);
    const lpTokenPrice = lpTotalSupply.gt(0)
      ? overallValueOfLPToken.div(lpTotalSupply)
      : zeroBN;

    console.log({
      hznRate: hznRate.toNumber(),
      hznInLp: hznInLp.toNumber(),
      lpTotalSupply: lpTotalSupply.toNumber(),
      lpTokenPrice: lpTokenPrice.toNumber(),
    });

    setLpPrice(lpTokenPrice.toNumber());
  }, [hznInLp, hznRate, lpTotalSupply, setLpPrice]);
}
