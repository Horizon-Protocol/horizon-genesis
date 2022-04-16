import { useQuery } from "react-query";
import { useUpdateAtom } from "jotai/utils";
import { fetchMarketPrices } from "@apis/coingecko";
import { marketPricesAtom } from "@atoms/staker/price";
import { EARN, PUBLIC } from "@utils/queryKeys";

export default function useFetchMarketPrices() {
  const setMarketPrices = useUpdateAtom(marketPricesAtom);

  useQuery(
    [EARN, PUBLIC, "market-prices"],
    async () => {
      const marketPrices = await fetchMarketPrices();
      return marketPrices;
    },
    {
      staleTime: 5000,
      onSuccess(marketPrices) {
        setMarketPrices(marketPrices);
      },
    }
  );
}
