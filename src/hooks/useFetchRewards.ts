import { useRequest } from "ahooks";
import { useUpdateAtom } from "jotai/utils";
import { ethers } from "ethers";
import horizon from "@lib/horizon";
import { rewardsAtom } from "@atoms/feePool";
import { toBigNumber } from "@utils/number";
import useWallet from "./useWallet";

export default function useFetchRewards() {
  const { account } = useWallet();

  const setRewards = useUpdateAtom(rewardsAtom);

  const { refres } = useRequest(
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
        stakingReward: toBigNumber(utils.formatEther(availableFees[0])),
        exchangeReward: toBigNumber(utils.formatEther(availableFees[0])),
      };
    },
    {
      ready: !!account && !!horizon.js,
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

  return { refres };
}
