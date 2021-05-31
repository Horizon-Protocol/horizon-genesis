import { useRequest } from "ahooks";
import { useAtomValue, useResetAtom, useUpdateAtom } from "jotai/utils";
import { ethers } from "ethers";
import horizon from "@lib/horizon";
import { needRefreshAtom } from "@atoms/app";
import { rewardsAtom, resetAtom } from "@atoms/feePool";
import { toBigNumber } from "@utils/number";
import useWallet from "./useWallet";
import useDisconnected from "./useDisconnected";

export default function useFetchRewards() {
  const { account } = useWallet();

  const needRefresh = useAtomValue(needRefreshAtom);
  const setRewards = useUpdateAtom(rewardsAtom);

  const resetRewards = useResetAtom(resetAtom);

  useDisconnected(resetRewards);

  const { refresh } = useRequest(
    async () => {
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
    {
      ready: !!account && !!horizon.js,
      refreshDeps: [account, needRefresh],
      onSuccess({ claimable, stakingReward, exchangeReward }) {
        console.log({
          claimable,
          stakingReward,
          exchangeReward,
        });
        setRewards({
          claimable,
          stakingReward,
          exchangeReward,
        });
      },
    }
  );

  return { refresh };
}
