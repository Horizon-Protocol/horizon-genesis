import fetch from "cross-fetch";

const ENDPOINT =
  "https://api.coingecko.com/api/v3/simple/price?ids=red-pulse,horizon-protocol&vs_currencies=USD";

interface Result {
  "red-pulse": {
    usd: number;
  };
  "horizon-protocol"?: {
    usd: number;
  };
}

export async function fetchPrice(): Promise<{ phb: number; hzn: number }> {
  try {
    const res = await fetch(ENDPOINT);
    const data: Result = await res.json();

    return {
      phb: data["red-pulse"].usd,
      hzn: data["horizon-protocol"]?.usd || 0,
    };
  } catch (error) {
    return { phb: 0, hzn: 0 };
  }
}
