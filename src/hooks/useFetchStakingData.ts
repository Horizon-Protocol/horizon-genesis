import { useCallback } from "react";
import { useUpdateAtom } from "jotai/utils";
import { BigNumber, constants } from "ethers";
import {
  stakedAtomFamily,
  earnedAtomFamily,
  withdrawableAtomFamily,
} from "@atoms/balance";
import useWallet from "./useWallet";
import useStaking from "./useStaking";
import { DEPRECATED_TOKENS } from "@utils/constants";

export default function useFetchStakingData(token: TokenEnum) {
  const { account } = useWallet();
  const stakingContract = useStaking(token);

  const isIgnore = DEPRECATED_TOKENS.indexOf(token) > -1;

  // staked
  const setStaked = useUpdateAtom(stakedAtomFamily(token));

  // earned
  const setEarned = useUpdateAtom(earnedAtomFamily(token));

  // withdraw
  const setWithdrawable = useUpdateAtom(withdrawableAtomFamily(token));

  const fetchData = useCallback(async () => {
    let res: BigNumber[] = [];
    if (account && stakingContract) {
      res = await Promise.all([
        stakingContract.balanceOf(account), // user staked
        stakingContract.earned(account), // user staked
        stakingContract.withdrawableAmount(account), // user withdrawable Amount
        stakingContract.totalSupply(), // total staked
        isIgnore ? constants.Zero : stakingContract.periodFinish(), // finish time
        isIgnore ? constants.Zero : stakingContract.rewardRate(), // rewards per second
        // stakingContract.rewardsDuration(), // rewardDuration in seconds
        stakingContract.lockDownDuration(), // lockDownDuration in seconds
      ]);
    }
    const [
      staked = constants.Zero,
      earned = constants.Zero,
      withdrawable = constants.Zero,
    ] = res;
    setStaked(staked);
    setEarned(earned);
    setWithdrawable(withdrawable);
    return constants.Zero;
  }, [
    account,
    isIgnore,
    setEarned,
    setStaked,
    setWithdrawable,
    stakingContract,
  ]);

  return fetchData;
}
