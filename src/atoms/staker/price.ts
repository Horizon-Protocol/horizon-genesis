import { atom } from "jotai";

declare global {
  type MarketPrices = Partial<{
    PHB: number;
    WBNB: number;
    BUSD: number;
    HZN: number;
    zUSD: number;
    zBNB: number;
    BNB: number;
  }>;
}
export const marketPricesAtom = atom<MarketPrices>({});
