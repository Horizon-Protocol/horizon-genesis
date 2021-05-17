import fetch from "cross-fetch";

const ENDPOINT = "https://api.pancakeswap.info/api/v2/pairs/";

interface Pair {
  pair_address: string;
  base_name: string;
  base_symbol: string;
  base_address: string;
  quote_name: string;
  quote_symbol: string;
  quote_address: string;
  price: string;
  base_volume: string;
  quote_volume: string;
  liquidity: string;
  liquidity_BNB: string;
}

const wBnbAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";

const hznAddress = "0xC0eFf7749b125444953ef89682201Fb8c6A917CD";

const pairAddress = `${wBnbAddress}_${hznAddress}`;

export async function fetchTotalLiquidity(): Promise<number> {
  try {
    const res = await fetch(ENDPOINT);
    const jsonData: { data: { [k: string]: Pair } } = await res.json();
    const pair = jsonData.data[pairAddress];

    if (pair) {
      return parseFloat(pair.liquidity);
    }
    return 0;
  } catch (error) {
    return 0;
  }
}
