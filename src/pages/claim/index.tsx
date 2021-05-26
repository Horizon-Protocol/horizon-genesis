import { useCallback, useMemo, useState } from "react";
import { Box } from "@material-ui/core";
import { ethers } from "ethers";
import { useAtomValue } from "jotai/utils";
import { rewardsAtom } from "@atoms/feePool";
import horizon from "@lib/horizon";
import { PAGE_COLOR } from "@utils/theme/constants";
import bg from "@assets/images/claim.png";
import useClaimCountDown from "@hooks/useClaimCountDown";
import PageCard from "@components/PageCard";
import RewardCard from "@components/Claim/RewardCard";
import InfoList, { Info } from "@components/InfoList";
import PrimaryButton from "@components/PrimaryButton";
import useFetchRewards from "@hooks/useFetchRewards";

const THEME_COLOR = PAGE_COLOR.claim;

export default function Earn() {
  const { refresh } = useFetchRewards();

  const { claimable, stakingReward, exchangeReward } =
    useAtomValue(rewardsAtom);

  const canClaim = useMemo(
    () => claimable && (stakingReward.isGreaterThan(0) || exchangeReward.gt(0)),
    [claimable, exchangeReward, stakingReward]
  );

  const { formatted } = useClaimCountDown();

  const mockInfoList: Info[] = [
    {
      label: "Next Reward Claim Period",
      value: formatted,
    },
    {
      label: "Claim Period Ends",
      value: "N/A",
    },
    {
      label: "Total Rewards",
      value: "0.00 HZN",
    },
    {
      label: "Lifetime Rewards",
      value: "0.00 HZN",
    },
  ];

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
    }
    setLoading(false);
  }, [refresh]);

  return (
    <PageCard
      mx='auto'
      color={THEME_COLOR}
      headerBg={bg}
      title='Claim'
      description={
        <>
          Claim rewards from staking HZN and minting zUSD. Claimed rewards are
          vested for 12 months from the clam date, but can be used to stake
          again to compound rewards during that time.
        </>
      }
    >
      <Box display='flex' justifyContent='space-between'>
        <RewardCard label='Staking Rewards' amount={stakingReward} />
        <RewardCard
          label='Exchange Rewards'
          amount={exchangeReward}
          disabled
          help={
            <>
              Available when <br /> Horizon Exchange launches
            </>
          }
        />
      </Box>
      <Box mt={3}>
        <InfoList data={mockInfoList} />
      </Box>
      <Box mt={3}>
        <PrimaryButton
          loading={loading}
          disabled={!canClaim}
          size='large'
          fullWidth
          onClick={handleClaim}
        >
          Claim Now
        </PrimaryButton>
      </Box>
    </PageCard>
  );
}
