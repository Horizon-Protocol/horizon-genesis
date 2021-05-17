import { atomFamily } from "jotai/utils";
import { BigNumber, constants } from "ethers";
import { Token } from "@utils/constants";

interface Data {
  total: BigNumber; // total staked
  rewardsPerBlock: BigNumber; // tokens per BSC block
  // rewardsDurationSeconds: BigNumber; // rewardsDuration in seconds
  lockDownSeconds: BigNumber; // lockdown period in seconds
  isRoundActive: boolean; // if the round is open
}

interface Param {
  token: Token;
  data?: Data;
}

const defaultData: Data = {
  total: constants.Zero,
  rewardsPerBlock: constants.Zero,
  // rewardsDurationSeconds: constants.Zero,
  lockDownSeconds: constants.Zero,
  isRoundActive: false,
};

export const statAtomFamily = atomFamily(
  ({ data = defaultData }: Param) => data,
  null,
  (a, b) => a.token === b.token
);

export const tokenStatAtomFamily = atomFamily(
  (token: Token) => (get) => get(statAtomFamily({ token })),
  (token: Token) => (get, set, data: Data) => {
    set(statAtomFamily({ token }), data);
  }
);
