import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import { Token } from "@utils/constants";
import { zeroBN } from "@utils/number";

interface Data {
  total: BN; // total staked
  rewardsPerBlock: BN; // tokens per BSC block
  // rewardsDurationSeconds: BN; // rewardsDuration in seconds
  lockDownSeconds: BN; // lockdown period in seconds
  isRoundActive: boolean; // if the round is open
}

interface Param {
  token: Token;
  data?: Data;
}

const defaultData: Data = {
  total: zeroBN,
  rewardsPerBlock: zeroBN,
  // rewardsDurationSeconds: zeroBN,
  lockDownSeconds: zeroBN,
  isRoundActive: false,
};

export const statAtomFamily = atomFamily(
  ({ data = defaultData }: Param) => atom(data),
  (a, b) => a.token === b.token
);

export const tokenStatAtomFamily = atomFamily((token: Token) =>
  atom(
    (get) => get(statAtomFamily({ token })),
    (get, set, data: Data) => {
      set(statAtomFamily({ token }), data);
    }
  )
);
