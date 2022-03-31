import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import { Token } from "@utils/constants";
import { lpStateAtom } from "./lp";
import { hznRateAtom } from "@atoms/exchangeRates";
import { toBN, zeroBN } from "@utils/number";

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
    (get) => {
      if (token.indexOf("LP") > -1) {
        let token1Price = zeroBN;
        if (token === Token.HZN_BNB_LP) {
          token1Price = get(hznRateAtom);
        } else if (token === Token.ZUSD_BUSD_LP) {
          const coingeckoPrice = get(coingeckoPriceAtom);
          token1Price = toBN(coingeckoPrice.busd);
        }
        if (token1Price.eq(0)) {
          return 0;
        }
        const lpState = get(lpStateAtom);
        if (!lpState[token]) {
          return 0;
        }
        const { totalSupply, token1Balance } = lpState[token]!;
        const overallValueOfLPToken = token1Balance
          .multipliedBy(2)
          .multipliedBy(token1Price);
        const lpTokenPrice = totalSupply.gt(0)
          ? overallValueOfLPToken.div(totalSupply).toNumber()
          : 0;

        // console.log("====lp", token, lpTokenPrice);
        return lpTokenPrice;
      }
      return get(priceAtomFamily({ token }));
    },
    (get, set, price: number) => {
      set(priceAtomFamily({ token }), price);
    }
  )
);

export const coingeckoPriceAtom = atom({
  phb: 0,
  busd: 0,
  zusd: 0,
});
