import fetch from "cross-fetch";

const ENDPOINT =
  "https://api.coingecko.com/api/v3/simple/price?ids=red-pulse,binance-usd,zasset-zusd&vs_currencies=USD";

type Names = "binance-usd" | "zasset-zusd" | "red-pulse";
type Result = { [k in Names]: { usd: number } };

export async function fetchPrice(): Promise<{
  phb: number;
  busd: number;
  zusd: number;
}> {
  try {
    const res = await fetch(ENDPOINT);
    const data: Result = await res.json();

    return {
      phb: data["red-pulse"].usd,
      busd: data["binance-usd"].usd,
      zusd: data["zasset-zusd"].usd,
    };
  } catch (error) {
    return { phb: 0, busd: 0, zusd: 0 };
  }
}
