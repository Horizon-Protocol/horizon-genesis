import { Box } from "@material-ui/core";
import { parseEther } from "@ethersproject/units";
import { PAGE_COLOR } from "@utils/theme/constants";
import { Token } from "@utils/constants";
import { zAssets } from "@utils/zAssets";
import bg from "@assets/images/claim.png";
import arrowRightImg from "@assets/images/burn-arrow-right.png";
import PageCard from "@components/PageCard";
import { TokenProps } from "@components/TokenPair";
import { Props as BalanceChangeProps } from "@components/BalanceChange";
import RewardCard from "@components/Claim/RewardCard";
import PrimaryButton from "@components/PrimaryButton";

const THEME_COLOR = PAGE_COLOR.claim;

export default function Earn() {
  const rewardHZN: TokenProps = {
    token: zAssets.zUSD,
    label: "Burn",
    color: THEME_COLOR,
    labelColor: THEME_COLOR,
    bgColor: "#0A1624",
    amount: parseEther("0"),
    max: parseEther("100"),
    maxButtonLabel: "Max Burn",
    inputPrefix: "$",
  };

  const toToken: TokenProps = {
    token: Token.HZN,
    label: "Stake",
    color: THEME_COLOR,
    amount: parseEther("0"),
    max: parseEther("100"),
    maxButtonLabel: "Max Unstake",
  };

  const mockRewardStats: BalanceChangeProps = {
    cRatio: {
      from: 1500,
      to: 700,
    },
    debt: {
      from: parseEther("6666"),
      to: parseEther("4444"),
    },
    staked: {
      from: parseEther("6666"),
      to: parseEther("4444"),
    },
    transferrable: {
      from: parseEther("6666"),
      to: parseEther("4444"),
    },
    gapImg: arrowRightImg,
  };

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
        <RewardCard label='Staking Rewards' amount={parseEther("100.66")} />
        <RewardCard
          label='Exchange Rewards'
          amount={parseEther("777777.7")}
          disabled
          help={
            <>
              Available when <br /> Horizon Exchange launches
            </>
          }
        />
      </Box>
      <Box mt={3}>
        <PrimaryButton size='large' fullWidth>
          Claim Now
        </PrimaryButton>
      </Box>
    </PageCard>
  );
}
