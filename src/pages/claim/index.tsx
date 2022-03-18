import { useCallback, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import { ethers } from "ethers";
import { useSnackbar } from "notistack";
import { useAtomValue } from "jotai/utils";
import { debtAtom } from "@atoms/debt";
import {
  rewardsAtom,
  nextClaimCountDownAtom,
  canClaimAtom,
} from "@atoms/feePool";
import horizon from "@lib/horizon";
import useWallet from "@hooks/useWallet";
import { COLOR,PAGE_COLOR } from "@utils/theme/constants";
import headerBg from "@assets/images/claim.svg";
import PageCard from "@components/PageCard";
import RewardCard from "@components/Claim/RewardCard";
import InfoList, { Info } from "@components/InfoList";
import PrimaryButton from "@components/PrimaryButton";
import useRefresh from "@hooks/useRefresh";
import { formatNumber } from "@utils/number";
import { getWalletErrorMsg } from "@utils/helper";
import { zAssets } from "@utils/zAssets";

const THEME_COLOR = PAGE_COLOR.claim;

export default function Claim() {
  const { connected } = useWallet();

  const { enqueueSnackbar } = useSnackbar();

  const { escrowedReward } = useAtomValue(debtAtom);
  const { stakingReward, exchangeReward } = useAtomValue(rewardsAtom);
  const canClaim = useAtomValue(canClaimAtom);

  const currentTotalRewards = useMemo(
    () => stakingReward.plus(exchangeReward),
    [stakingReward, exchangeReward]
  );

  const nextClaimCountDown = useAtomValue(nextClaimCountDownAtom);

  const infoList: Info[] = [
    {
      label: "Next Reward Claim",
      value: nextClaimCountDown,
    },
    {
      label: "Current Claim Period Ends",
      value: nextClaimCountDown,
    },
    {
      label: "Lifetime Claimed Rewards",
      value: `${formatNumber(currentTotalRewards)} HZN / ${formatNumber(currentTotalRewards)} zUSD`,
    },
    {
      label: "Total Rewards this Period",
      value: `${formatNumber(currentTotalRewards)} HZN`,
    }, 
    {
      label: "Total Claimed Rewards",
      value: `${formatNumber(escrowedReward)} HZN`,
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
    } catch (e: any) {
      enqueueSnackbar(getWalletErrorMsg(e), {
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
      <Typography sx={{
        width: "100%",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: "12px",
        mb: "10px"
      }}>
        CLAIMABLE REWARDS
      </Typography>
      <Box display='flex' justifyContent='space-between'>
        <RewardCard label='STAKING REWARDS' amount={stakingReward} />
        <RewardCard
          label='EXCHANGE REWARDS'
          amount={exchangeReward}
          token={zAssets.zUSD}
        />
      </Box>
      <Typography sx={{
        width: "100%",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: "12px",
        mt:"20px",
        mb:"10px"
      }}>
        UPCOMING REWARDS
      </Typography>
      <Box display='flex' justifyContent='space-between'>
        <RewardCard
        height={87}
        upcoming={true} 
        label={<><Box
        component="span"
           sx={{
             fontSize: 7,
              color:COLOR.text, 
             opacity:.5
        }}>ESTIMATED</Box><br />STAKING REWARDS</>}
        amount={stakingReward} />
        <RewardCard
          height={87}
          upcoming={true} 
          label={<><Box
            component="span"
               sx={{
                 fontSize: 7,
                  color:COLOR.text, 
                 opacity:.5
            }}>ACCRUED</Box><br />EXCHANGE REWARDS</>}
          amount={exchangeReward}
          token={zAssets.zUSD}
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
