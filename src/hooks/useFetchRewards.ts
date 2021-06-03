import { useCallback } from "react";
import { useQuery, QueryFunction } from "react-query";
import { useResetAtom, useUpdateAtom } from "jotai/utils";
import { ethers } from "ethers";
import horizon from "@lib/horizon";
import { rewardsAtom, resetAtom } from "@atoms/feePool";
import { CONTRACT } from "@utils/queryKeys";
import { etherToBN } from "@utils/number";
import useWallet from "./useWallet";
import useDisconnected from "./useDisconnected";

interface Result {
  claimable: boolean;
  exchangeReward: BN;
  stakingReward: BN;
}

export default function useFetchRewards() {
  const { account } = useWallet();

  const setRewards = useUpdateAtom(rewardsAtom);

  const resetRewards = useResetAtom(resetAtom);

  useDisconnected(resetRewards);

  const fetcher = useCallback<QueryFunction<Result, string[]>>(async () => {
    const {
      contracts: { FeePool },
    } = horizon.js!;

    const [claimable, availableFees] = (await Promise.all([
      FeePool.isFeesClaimable(account),
      FeePool.feesAvailable(account),
    ])) as [boolean, [ethers.BigNumber, ethers.BigNumber]];
    return {
      claimable,
      exchangeReward: etherToBN(availableFees[0]),
      stakingReward: etherToBN(availableFees[1]),
    };
  }, [account]);

  const { refetch } = useQuery([CONTRACT, account, "rewards"], fetcher, {
    enabled: !!account && !!horizon.js,
    onSuccess({ claimable, stakingReward, exchangeReward }) {
      // console.log({
      //   claimable,
      //   stakingReward,
      //   exchangeReward,
      // });
      setRewards({
        claimable,
        stakingReward,
        exchangeReward,
      });
    },
  });

  return refetch;
}
