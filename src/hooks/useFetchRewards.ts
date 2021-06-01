import { useCallback } from "react";
import { useQuery, QueryFunction } from "react-query";
import { useAtomValue, useResetAtom, useUpdateAtom } from "jotai/utils";
import { ethers } from "ethers";
import horizon from "@lib/horizon";
import { needRefreshAtom } from "@atoms/app";
import { rewardsAtom, resetAtom } from "@atoms/feePool";
import { CONTRACT, USER } from "@utils/queryKeys";
import { toBigNumber } from "@utils/number";
import useWallet from "./useWallet";
import useDisconnected from "./useDisconnected";

interface Result {
  claimable: boolean;
  exchangeReward: BN;
  stakingReward: BN;
}

export default function useFetchRewards() {
  const { account } = useWallet();

  const needRefresh = useAtomValue(needRefreshAtom);
  const setRewards = useUpdateAtom(rewardsAtom);

  const resetRewards = useResetAtom(resetAtom);

  useDisconnected(resetRewards);

  const fetcher = useCallback<
    QueryFunction<Result, [string, string, string, boolean]>
  >(
    async ({ queryKey }) => {
      console.log("fetch", ...queryKey);
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
        exchangeReward: toBigNumber(utils.formatEther(availableFees[0])),
        stakingReward: toBigNumber(utils.formatEther(availableFees[1])),
      };
    },
    [account]
  );

  const { refetch } = useQuery(
    [CONTRACT, USER, "rewards", needRefresh],
    fetcher,
    {
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
    }
  );

  return { refresh: refetch };
}
