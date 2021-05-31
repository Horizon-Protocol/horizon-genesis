import { useCallback, useMemo, useState } from "react";
import { Box } from "@material-ui/core";
import { ethers } from "ethers";
import { useSnackbar } from "notistack";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { balanceChangedAtom } from "@atoms/app";
import { rewardsAtom, feePeriodDatesAtom } from "@atoms/feePool";
import horizon from "@lib/horizon";
import useWallet from "@hooks/useWallet";
import { PAGE_COLOR } from "@utils/theme/constants";
import bg from "@assets/images/claim.png";
import useClaimCountDown from "@hooks/useClaimCountDown";
import PageCard from "@components/PageCard";
import RewardCard from "@components/Claim/RewardCard";
import InfoList, { Info } from "@components/InfoList";
import PrimaryButton from "@components/PrimaryButton";
import useFetchRewards from "@hooks/useFetchRewards";
import { formatNumber } from "@utils/number";

const THEME_COLOR = PAGE_COLOR.claim;

export default function Earn() {
  const { connected } = useWallet();
  const { refresh } = useFetchRewards();

  const { enqueueSnackbar } = useSnackbar();

  const { claimable, stakingReward, exchangeReward } =
    useAtomValue(rewardsAtom);

  const totalRewards = useMemo(
    () => stakingReward.plus(exchangeReward),
    [stakingReward, exchangeReward]
  );

  const canClaim = useMemo(
    () => claimable && totalRewards.isGreaterThan(0),
    [claimable, totalRewards]
  );

  const { nextFeePeriodStarts } = useAtomValue(feePeriodDatesAtom);
  const { formatted } = useClaimCountDown(nextFeePeriodStarts);

  const mockInfoList: Info[] = [
    {
      label: "Next Reward Claim Period",
      value: formatted,
    },
    {
      label: "Claim Period Ends",
      value: formatted,
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

  const setBalanceChanged = useUpdateAtom(balanceChangedAtom);
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
      setBalanceChanged(true);
    } catch (e) {
      console.log(e);
      console.log(e.error);
      const detail = `${e.error?.code}: ${e.error?.reason}`;
      enqueueSnackbar(e.error ? detail : "Operation Failed", {
        variant: "error",
      });
    }
    setLoading(false);
  }, [enqueueSnackbar, refresh, setBalanceChanged]);

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
