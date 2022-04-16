import { atom } from "jotai";

export type State = {
  [t in TokenEnum]?: {
    totalSupply: BN;
    token1Balance: BN;
    token2Balance: BN;
  };
};
export const lpStateAtom = atom<State>({});
