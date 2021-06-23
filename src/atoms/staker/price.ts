import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import { Token } from "@utils/constants";
import { zeroBN } from "@utils/number";

interface Param {
  token: Token;
  price?: number;
}

export const priceAtomFamily = atomFamily(
  ({ price = 0 }: Param) => atom(price),
  (a, b) => a.token === b.token
);

export const tokenPriceAtomFamily = atomFamily((token: Token) =>
  atom(
    (get) => get(priceAtomFamily({ token })),
    (get, set, price: number) => {
      set(priceAtomFamily({ token }), price);
    }
  )
);
