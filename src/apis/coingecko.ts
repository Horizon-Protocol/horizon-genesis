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

    let phbPrice = data["red-pulse"].usd;

    // TODO
    if (phbPrice && phbPrice < 0.1) {
      phbPrice = phbPrice * 100;
    }
    console.log('fetchPrice',{
      data: data,
      phb: phbPrice,
      busd: data["binance-usd"].usd,
      zusd: data["zasset-zusd"].usd,
    })
    
// data:{
//    binance-usd: {usd: 1.011}
//    red-pulse: {usd: 0.915194}
//    zasset-zusd: {usd: 0.941583}
// }

// busd: 1.011
// phb: 0.915194
// zusd: 0.941583

// TODO formula
// ((token1Balance * token1Price) + (token2Balance * token2Price)) / lpTokenTotalSupply
    return {
      phb: phbPrice,
      busd: data["binance-usd"].usd,
      zusd: data["zasset-zusd"].usd,
    };
  } catch (error) {
    return { phb: 0, busd: 0, zusd: 0 };
  }
}
