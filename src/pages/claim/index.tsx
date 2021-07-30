import { useCallback, useMemo, useState } from "react";
import { Box } from "@material-ui/core";
import { ethers } from "ethers";
import { useSnackbar } from "notistack";
import { useAtomValue } from "jotai/utils";
import {
  rewardsAtom,
  nextClaimCountDownAtom,
  canClaimAtom,
} from "@atoms/feePool";
import horizon from "@lib/horizon";
import useWallet from "@hooks/useWallet";
import { PAGE_COLOR } from "@utils/theme/constants";
import headerBg from "@assets/images/claim.svg";
import PageCard from "@components/PageCard";
import RewardCard from "@components/Claim/RewardCard";
import InfoList, { Info } from "@components/InfoList";
import PrimaryButton from "@components/PrimaryButton";
import useFetchRewards from "@hooks/useFetchRewards";
import useRefresh from "@hooks/useRefresh";
import { formatNumber } from "@utils/number";
import { zAssets } from "@utils/zAssets";

const THEME_COLOR = PAGE_COLOR.claim;

export default function Claim() {
  const { connected } = useWallet();
  useFetchRewards();

  const { enqueueSnackbar } = useSnackbar();

  const { stakingReward, exchangeReward } = useAtomValue(rewardsAtom);
  const canClaim = useAtomValue(canClaimAtom);

  const totalRewards = useMemo(
    () => stakingReward.plus(exchangeReward),
    [stakingReward, exchangeReward]
  );

  const nextClaimCountDown = useAtomValue(nextClaimCountDownAtom);

  const infoList: Info[] = [
    {
      label: "Next Reward Claim Period",
      value: nextClaimCountDown,
    },
    {
      label: "Claim Period Ends",
      value: nextClaimCountDown,
    },
    {
      label: "Total Rewards",
      value: `${formatNumber(totalRewards)} HZN`,
    },
    // {
    //   label: "Lifetime Rewards",
    //   value: "0.00 HZN",
    // },
  ];

  const refresh = useRefresh();
  const [loading, setLoading] = useState(false);
  const handleClaim = useCallback(async () => {
    try {
      const {
        contracts: { FeePool },
      } = horizon.js!;
      setLoading(true);
      const tx: ethers.ContractTransaction = await FeePool.claimFees();
      await tx.wait(1);
      refresh();
    } catch (e) {
      console.log(e);
      console.log(e.error);
      const detail = `${e.error?.code}: ${e.error?.reason}`;
      enqueueSnackbar(e.error ? detail : "Operation Failed", {
        variant: "error",
      });
    }
    setLoading(false);
  }, [enqueueSnackbar, refresh]);

  return (
    <PageCard
      mx='auto'
      color={THEME_COLOR}
      headerBg={headerBg}
      title='Claim'
      description={
        <>
          Claim rewards from staking HZN and minting zUSD. Claimed rewards are
          vested for 12 months from the claim date, but can be used to stake
          again to compound rewards during that time.
        </>
      }
    >
      <Box display='flex' justifyContent='space-between'>
        <RewardCard label='Staking Rewards' amount={stakingReward} />
        <RewardCard
          label='Exchange Rewards'
          amount={exchangeReward}
          token={zAssets.zUSD}
          disabled
          help={
            <>
              Available when <br /> Horizon Exchange launches
            </>
          }
        />
      </Box>
      <Box mt={3}>
        <InfoList data={infoList} />
      </Box>
      <Box mt={3}>
        {connected && (
          <PrimaryButton
            loading={loading}
            disabled={!canClaim}
            size='large'
            fullWidth
            onClick={handleClaim}
          >
            Claim Now
          </PrimaryButton>
        )}
      </Box>
    </PageCard>
  );
}
