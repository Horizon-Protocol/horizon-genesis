import { atomFamily } from "jotai/utils";
import { BigNumber, constants } from "ethers";
import { Token } from "@utils/constants";

export enum BalanceType {
  available = "available",
  staked = "staked",
  earned = "earned",
  withdrawable = "withdrawable",
  totalSupply = "totalSupply",
}

interface Param {
  token: Token;
  balance: BalanceType;
  amount?: BigNumber; // total staked
}

export const amountAtomFamily = atomFamily(
  ({ amount = constants.Zero }: Param) => amount,
  null,
  (a, b) => a.token === b.token && a.balance === b.balance
);

export const availableAtomFamily = atomFamily(
  (token: Token) => (get) =>
    get(amountAtomFamily({ token, balance: BalanceType.available })),
  (token: Token) => (get, set, amount: BigNumber) => {
    set(amountAtomFamily({ token, balance: BalanceType.available }), amount);
  }
);

export const stakedAtomFamily = atomFamily(
  (token: Token) => (get) =>
    get(amountAtomFamily({ token, balance: BalanceType.staked })),
  (token: Token) => (get, set, amount: BigNumber) => {
    set(amountAtomFamily({ token, balance: BalanceType.staked }), amount);
  }
);
export const earnedAtomFamily = atomFamily(
  (token: Token) => (get) =>
    get(amountAtomFamily({ token, balance: BalanceType.earned })),
  (token: Token) => (get, set, amount: BigNumber) => {
    set(amountAtomFamily({ token, balance: BalanceType.earned }), amount);
  }
);
export const withdrawableAtomFamily = atomFamily(
  (token: Token) => (get) =>
    get(amountAtomFamily({ token, balance: BalanceType.withdrawable })),
  (token: Token) => (get, set, amount: BigNumber) => {
    set(amountAtomFamily({ token, balance: BalanceType.withdrawable }), amount);
  }
);
export const totalSupplyAtomFamily = atomFamily(
  (token: Token) => (get) =>
    get(amountAtomFamily({ token, balance: BalanceType.totalSupply })),
  (token: Token) => (get, set, amount: BigNumber) => {
    set(amountAtomFamily({ token, balance: BalanceType.totalSupply }), amount);
  }
);

type AllowanceParam = { token: Token; amount?: BigNumber };
const allowanceAtomFamily = atomFamily(
  ({ amount = constants.Zero }: AllowanceParam) => amount,
  null,
  (a, b) => a.token === b.token
);
export const tokenAllowanceAtomFamily = atomFamily(
  (token: Token) => (get) => get(allowanceAtomFamily({ token })),
  (token: Token) => (get, set, amount: BigNumber) =>
    set(allowanceAtomFamily({ token }), amount)
);
