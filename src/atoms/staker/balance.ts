import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import { BigNumber, constants } from "ethers";
import { Token } from "@utils/constants";

export enum BalanceName {
  available = "available",
  staked = "staked",
  earned = "earned",
  withdrawable = "withdrawable",
  totalSupply = "totalSupply",
}

interface Param {
  token: Token;
  name: BalanceName;
  amount?: BigNumber; // total staked
}

export const amountAtomFamily = atomFamily(
  ({ amount = constants.Zero }: Param) => atom(amount),
  (a, b) => a.token === b.token && a.name === b.name
);

export const availableAtomFamily = atomFamily((token: Token) =>
  atom(
    (get) => get(amountAtomFamily({ token, name: BalanceName.available })),
    (get, set, amount: BigNumber) => {
      set(amountAtomFamily({ token, name: BalanceName.available }), amount);
    }
  )
);

export const stakedAtomFamily = atomFamily((token: Token) =>
  atom(
    (get) => get(amountAtomFamily({ token, name: BalanceName.staked })),
    (get, set, amount: BigNumber) => {
      set(amountAtomFamily({ token, name: BalanceName.staked }), amount);
    }
  )
);
export const earnedAtomFamily = atomFamily((token: Token) =>
  atom(
    (get) => get(amountAtomFamily({ token, name: BalanceName.earned })),
    (get, set, amount: BigNumber) => {
      set(amountAtomFamily({ token, name: BalanceName.earned }), amount);
    }
  )
);
export const withdrawableAtomFamily = atomFamily((token: Token) =>
  atom(
    (get) => get(amountAtomFamily({ token, name: BalanceName.withdrawable })),
    (get, set, amount: BigNumber) => {
      set(amountAtomFamily({ token, name: BalanceName.withdrawable }), amount);
    }
  )
);
export const totalSupplyAtomFamily = atomFamily((token: Token) =>
  atom(
    (get) => get(amountAtomFamily({ token, name: BalanceName.totalSupply })),
    (get, set, amount: BigNumber) => {
      set(amountAtomFamily({ token, name: BalanceName.totalSupply }), amount);
    }
  )
);

type AllowanceParam = { token: Token; amount?: BigNumber };

const allowanceAtomFamily = atomFamily(
  ({ amount = constants.Zero }: AllowanceParam) => atom(amount),
  (a, b) => a.token === b.token
);

export const tokenAllowanceAtomFamily = atomFamily((token: Token) =>
  atom(
    (get) => get(allowanceAtomFamily({ token })),
    (get, set, amount: BigNumber) => set(allowanceAtomFamily({ token }), amount)
  )
);