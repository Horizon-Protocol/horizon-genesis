import { atom } from "jotai";

declare global {
  type MarketPrices = Partial<{
    PHB: number;
    WBNB: number;
    BUSD: number;
    HZN: number;
    zUSD: number;
  }>;
}
export const marketPricesAtom = atom<MarketPrices>({});
