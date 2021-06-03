import { useCallback } from "react";
import { useQuery, QueryFunction } from "react-query";
import { useResetAtom, useUpdateAtom } from "jotai/utils";
import { ethers } from "ethers";
import horizon from "@lib/horizon";
import { rewardsAtom, resetAtom } from "@atoms/feePool";
import { CONTRACT, USER } from "@utils/queryKeys";
import { toBN } from "@utils/number";
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
      utils,
    } = horizon.js!;

    const [claimable, availableFees] = (await Promise.all([
      FeePool.isFeesClaimable(account),
      FeePool.feesAvailable(account),
    ])) as [boolean, [ethers.BigNumber, ethers.BigNumber]];
    return {
      claimable,
      exchangeReward: toBN(utils.formatEther(availableFees[0])),
      stakingReward: toBN(utils.formatEther(availableFees[1])),
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
