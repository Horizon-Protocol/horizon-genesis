import { atom } from "jotai";
import { atomFamily, atomWithReset, RESET } from "jotai/utils";
import { zeroBN } from "@utils/number";

interface State {
  // token
  totalSupply: BN;

  // pool stat
  totalStaked: BN; // total staked in pool
  rewardsPerBlock: BN; // tokens per BSC block
  // rewardsDurationSeconds: number; // rewardsDuration in seconds
  lockDownSeconds: number; // lockdown period in seconds
  isRoundActive: boolean; // if the round is open

  // account
  allowance?: BN;
  available: BN; // available | transferrable
  staked: BN;
  earned: BN;
  withdrawable: BN;
}

interface Param {
  token: TokenEnum;
  state?: State; // pool state
}

const defaultState: State = {
  // token
  totalSupply: zeroBN,

  // pool stat
  totalStaked: zeroBN, // total staked in pool
  rewardsPerBlock: zeroBN, // tokens per BSC block
  // rewardsDurationSeconds: 0, // rewardsDuration in seconds
  lockDownSeconds: 0, // lockdown period in seconds
  isRoundActive: false, // if the round is open

  // account
  allowance: undefined,
  available: zeroBN, // available | transferrable
  staked: zeroBN,
  earned: zeroBN,
  withdrawable: zeroBN,
};

const stateAtomFamily = atomFamily(
  ({ state = defaultState }: Param) => atomWithReset(state),
  (a, b) => a.token === b.token
);

export const poolStateAtomFamily = atomFamily((token: TokenEnum) =>
  atom(
    (get) => get(stateAtomFamily({ token })),
    (get, set, state: Partial<State>) => {
      set(stateAtomFamily({ token }), (prev) => ({ ...prev, ...state }));
    }
  )
);

export const resetPoolStateAtomFamily = atomFamily((token: TokenEnum) =>
  atom(null, (get, set) => {
    set(stateAtomFamily({ token }), RESET);
  })
);
