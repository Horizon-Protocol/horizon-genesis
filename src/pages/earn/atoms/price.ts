import { atomFamily } from "jotai/utils";
import { Token } from "@utils/constants";

interface Param {
  token: Token;
  price?: number;
}

export const priceAtomFamily = atomFamily(
  ({ price = 0 }: Param) => price,
  null,
  (a, b) => a.token === b.token
);

export const tokenPriceAtomFamily = atomFamily(
  (token: Token) => (get) => get(priceAtomFamily({ token })),
  (token: Token) => (get, set, price: number) => {
    set(priceAtomFamily({ token }), price);
  }
);
