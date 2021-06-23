import fetch from "cross-fetch";

const ENDPOINT =
  "https://api.coingecko.com/api/v3/simple/price?ids=red-pulse&vs_currencies=USD";

interface Result {
  "red-pulse": {
    usd: number;
  };
  wbnb: {
    usd: number;
  };
}

export async function fetchPrice(): Promise<{
  phb: number;
}> {
  try {
    const res = await fetch(ENDPOINT);
    const data: Result = await res.json();

    return {
      phb: data["red-pulse"].usd,
    };
  } catch (error) {
    return { phb: 0 };
  }
}
