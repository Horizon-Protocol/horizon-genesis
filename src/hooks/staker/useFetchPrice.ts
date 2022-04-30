import { useCallback, useState } from "react";
import { useQuery } from "react-query";
import { useUpdateAtom } from "jotai/utils";
import { fetchPrice } from "@apis/coingecko";
import { coingeckoPriceAtom, tokenPriceAtomFamily } from "@atoms/staker/price";
import { Token } from "@utils/constants";
import { EARN, PUBLIC } from "@utils/queryKeys";
import useFetchLpPrice from "@utils/fetchLpPrice";

export default function useFetchPrice() {
  const [timestamp, setTimestamp] = useState<number>(0);

  useFetchLpPrice();

  const setPHBPrice = useUpdateAtom(tokenPriceAtomFamily(Token.PHB));
  const setCoingeckoPrice = useUpdateAtom(coingeckoPriceAtom);

  const fetcher = useCallback(async () => {
    const now = Date.now() / 1000;

    if (now - timestamp < 5) {
      return;
    }
    setTimestamp(now);
    const coingeckoPrice = await fetchPrice();

    console.log('coingeckoPrice',coingeckoPrice)

    setCoingeckoPrice(coingeckoPrice);
    setPHBPrice(coingeckoPrice.phb);
  }, [timestamp, setCoingeckoPrice, setPHBPrice]);

  useQuery([EARN, PUBLIC, "price"], fetcher);
}
