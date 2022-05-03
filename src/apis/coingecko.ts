import fetch from "cross-fetch";

const API_PRICE =
  "https://api.coingecko.com/api/v3/simple/price?ids=red-pulse,wbnb,binance-usd,horizon-protocol,zasset-zusd&vs_currencies=USD";

interface PriceResult {
  "red-pulse": {
    usd: number;
  };
  wbnb: {
    usd: number;
  };
  "binance-usd": {
    usd: number;
  };
  "horizon-protocol": {
    usd: number;
  };
  "zasset-zusd": {
    usd: number;
  };
}

export async function fetchMarketPrices(): Promise<MarketPrices> {
  try {
    const res = await fetch(API_PRICE);
    const data: PriceResult = await res.json();

    return {
      PHB: data["red-pulse"].usd,
      WBNB: data["wbnb"].usd,
      BUSD: data["binance-usd"].usd,
      HZN: data["horizon-protocol"].usd,
      zUSD: data["zasset-zusd"].usd,
    };
  } catch (error) {
    return {};
  }
}
