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
  nextClaimCountDownDurationAtom,
} from "@atoms/feePool";
import horizon from "@lib/horizon";
import useWallet from "@hooks/useWallet";
import { COLOR, PAGE_COLOR } from "@utils/theme/constants";
import headerBg from "@assets/images/claim.svg";
import PageCard from "@components/PageCard";
import RewardCard from "@components/Claim/RewardCard";
import InfoList, { Info } from "@components/InfoList";
import PrimaryButton from "@components/PrimaryButton";
import useRefresh from "@hooks/useRefresh";
import { formatNumber, toBN, zeroBN } from "@utils/number";
import { getWalletErrorMsg } from "@utils/helper";
import { historicalClaimHZNAndZUSDAtom, historicalOperationAtom } from "@atoms/record";
import { ratiosPercentAtom, targetRatioAtom } from "@atoms/app";
import { secondsOfDays } from "@utils/date";
import { ReactComponent as IconHZN } from "@assets/images/hzn.svg";
import { ReactComponent as IconzUSD } from "@assets/images/zUSD.svg";
import Tooltip from "@components/Tooltip";
import ToolTipContent from "@components/Tooltip/ToolTipContent";

const THEME_COLOR = PAGE_COLOR.claim;

export default function Claim() {
  const { connected } = useWallet();

  const { enqueueSnackbar } = useSnackbar();
  const historicalClaim = useAtomValue(historicalClaimHZNAndZUSDAtom)

  const { escrowedReward } = useAtomValue(debtAtom);
  const { stakingReward, exchangeReward, upcomingStakingReward, upcomingExchangeReward } = useAtomValue(rewardsAtom);
  const canClaim = useAtomValue(canClaimAtom);
  const targetRatio = useAtomValue(targetRatioAtom);
  const { currentCRatio } = useAtomValue(debtAtom);
  const { targetCRatioPercent } = useAtomValue(ratiosPercentAtom);
  const lifeTimeClaimed = useMemo(
    () => {
      let ltHZN = zeroBN
      let ltzUSD = zeroBN
      historicalClaim.forEach(element => {
        ltHZN = ltHZN.plus(element.rewards)
        ltzUSD = ltzUSD.plus(element.value)
      });
      return ({
        ltHZN,
        ltzUSD
      })
    },
    [historicalClaim]
  );

  const ableToClaim = useMemo(() => {
    // console.log("ableToClaim", {
    //   currentCRatio: formatNumber(currentCRatio),
    //   targetRatio: formatNumber(targetRatio)
    // })
    if (currentCRatio.gt(targetRatio)) {
      return false
    } else {
      return canClaim
    }
  }, [canClaim, targetRatio])

  const currentTotalRewards = useMemo(
    // dayjs.duration()
    () => stakingReward.plus(exchangeReward),
    [stakingReward, exchangeReward]
  );

  const nextClaimCountDown = useAtomValue(nextClaimCountDownAtom);

  const nextClaimCountDownDuration = useAtomValue(nextClaimCountDownDurationAtom);
  const warning = useMemo(() => {
    if (0 < nextClaimCountDownDuration && nextClaimCountDownDuration < secondsOfDays(2) && stakingReward.isGreaterThan(zeroBN) && connected) {
      return true
    }
    return false
  }, [nextClaimCountDownDuration,stakingReward,connected])

  const infoList: Info[] = [
    {
      label: "Next Reward Claim",
      value: nextClaimCountDown,
    },
    {
      label: "Current Claim Period Ends",
      value: nextClaimCountDown,
      warning: connected ? warning : false,
    },
    {
      label: "Lifetime Claimed Rewards",
      value: `${formatNumber(lifeTimeClaimed.ltHZN)} HZN / ${formatNumber(lifeTimeClaimed.ltzUSD)} zUSD`,
    },
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
        mb: "10px",
        color: COLOR.text,
        letterSpacing: '1px'
      }}>
        CLAIMABLE REWARDS
      </Typography>
      <Box display='flex' justifyContent='space-between'>
        <RewardCard
          label={
            <Tooltip
              title={<ToolTipContent title='STAKING REWARDS' conetnt='STAKING REWARDS content' />}
              placement='top'
            >
              <Box>STAKING REWARDS</Box>
            </Tooltip>
          }
          amount={stakingReward}
          token='HZN'
          svg={<IconHZN />}
        />
        <RewardCard
          label={
            <Tooltip
              title={<ToolTipContent title='EXCHANGE REWARDS' conetnt='EXCHANGE REWARDS content' />}
              placement='top'
            >
              <Box>EXCHANGE REWARDS</Box>
            </Tooltip>
          }
          height={{
            xs:113,
            md:123
          }}
          amount={exchangeReward}
          token='zUSD'
          svg={<IconzUSD />}
        />
      </Box>
      <Typography sx={{
        width: "100%",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: "12px",
        mt: "20px",
        mb: "10px",
        color: COLOR.text,
        letterSpacing: '1px'
      }}>
        UPCOMING REWARDS
      </Typography>
      <Box display='flex' justifyContent='space-between'>
        <RewardCard
          height={{
            xs:83,
            md:87
          }}
          upcoming={true}
          label={
            <Tooltip
              title={<ToolTipContent title='ESTIMATED STAKING REWARDS' conetnt='ESTIMATED STAKING REWARDS content' />}
              placement='top'
            >
              <Box><Box
                component="span"
                sx={{
                  fontSize: 7,
                  color: COLOR.text,
                  opacity: .5
                }}>ESTIMATED</Box><br />STAKING REWARDS</Box>
            </Tooltip>
          }
          amount={upcomingStakingReward} />
        <RewardCard
          height={{
            xs:83,
            md:87
          }}
          upcoming={true}
          label={
            <Tooltip
              title={<ToolTipContent title='ACCRUED EXCHANGE REWARDS' conetnt='ACCRUED EXCHANGE REWARDS content' />}
              placement='top'
            >
              <Box><Box
                component="span"
                sx={{
                  fontSize: 7,
                  color: COLOR.text,
                  opacity: .5
                }}>ACCRUED</Box><br />EXCHANGE REWARDS</Box>
            </Tooltip>
          }
          amount={upcomingExchangeReward}
          svg={<IconzUSD />}
        />
      </Box>
      <Box mt={3}>
        <InfoList data={infoList} />
      </Box>
      <Box mt={3}>
        {connected && (
          <PrimaryButton
            loading={loading}
            disabled={!ableToClaim}
            size='large'
            fullWidth
            onClick={handleClaim}
          >
            Claim Now
          </PrimaryButton>
        )}
        {currentCRatio.gt(targetRatio) && (
          <Typography sx={{
            mt: '10px',
            textAlign: 'center',
            color: '#FA2256',
            fontSize: "12px",
            letterSpacing: '0.5px',
            lineHeight: "14px"
          }}>
            You need to restore your C-Ratio back to {targetCRatioPercent}%<br />
            before you can claim your rewards.</Typography>
        )}
      </Box>
    </PageCard>
  );
}
