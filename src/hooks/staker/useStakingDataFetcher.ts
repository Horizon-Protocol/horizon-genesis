import { useCallback } from "react";
import { useUpdateAtom } from "jotai/utils";
import { BigNumber } from "ethers";
import {
  stakedAtomFamily,
  earnedAtomFamily,
  withdrawableAtomFamily,
} from "@atoms/staker/balance";
import { etherToBN } from "@utils/number";
import useWallet from "../useWallet";
import { useMultiCallStaking } from "./useStaking";

export default function useStakingDataFetcher(token: TokenEnum) {
  const { account } = useWallet();
  const { contract: stakingContract, getProvider: getMultiCallProvider } =
    useMultiCallStaking(token);

  // staked
  const setStaked = useUpdateAtom(stakedAtomFamily(token));

  // earned
  const setEarned = useUpdateAtom(earnedAtomFamily(token));

  // withdraw
  const setWithdrawable = useUpdateAtom(withdrawableAtomFamily(token));

  const fetcher = useCallback(async () => {
    if (account && stakingContract) {
      const multiCallProvider = await getMultiCallProvider();

      const res = (await multiCallProvider.all([
        stakingContract.balanceOf(account), // user staked
        stakingContract.earned(account), // user staked
        stakingContract.withdrawableAmount(account), // user withdrawable Amount
      ])) as BigNumber[];
      const [staked, earned, withdrawable] = res.map(etherToBN);
      setStaked(staked);
      setEarned(earned);
      setWithdrawable(withdrawable);
    }
  }, [
    account,
    getMultiCallProvider,
    setEarned,
    setStaked,
    setWithdrawable,
    stakingContract,
  ]);

  return fetcher;
}
