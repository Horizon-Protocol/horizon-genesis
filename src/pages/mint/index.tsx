import { useState } from "react";
import { Box } from "@material-ui/core";
import { parseEther } from "@ethersproject/units";
import { PAGE_COLOR } from "@utils/theme/constants";
import { Token } from "@utils/constants";
import { zAssets } from "@utils/zAssets";
import bgMint from "@assets/images/mint.png";
import arrowImg from "@assets/images/mint-arrow.png";
import arrowRightImg from "@assets/images/mint-arrow-right.png";
import PageCard from "@components/PageCard";
import PresetCRatioOptions from "@components/PresetCRatioOptions";
import TokenPair, { TokenProps } from "@components/TokenPair";
import BalanceChange, {
  Props as BalanceChangeProps,
} from "@components/BalanceChange";
import PrimaryButton from "@components/PrimaryButton";

const THEME_COLOR = PAGE_COLOR.mint;

const presetCratioOptions: PresetCRatioOption[] = [
  {
    title: "CONSERVATIVE",
    percent: 1000,
    color: THEME_COLOR,
  },
  {
    title: "NEUTRAL",
    percent: 850,
    color: THEME_COLOR,
  },
  {
    title: "AGGRESSIVE",
    percent: 700,
    color: THEME_COLOR,
  },
];

export default function Earn() {
  const [targetCRatio, setTargetCRatio] = useState<number>();

  const fromToken: TokenProps = {
    token: Token.HZN,
    label: "Stake",
    amount: parseEther("0"),
    max: parseEther("100"),
    maxButtonLabel: "Max Mint",
    color: THEME_COLOR,
    labelColor: THEME_COLOR,
  };

  const toToken: TokenProps = {
    token: zAssets.zUSD,
    label: "Mint",
    color: THEME_COLOR,
    bgColor: "#0A1624",
    amount: parseEther("0"),
    balanceLabel: "Minted at 700% C-Ratio",
    inputPrefix: "$",
  };

  const mockBalanceChange: BalanceChangeProps = {
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
      headerBg={bgMint}
      title='Mint'
      description={
        <>
          Mint zUSD by staking your HZN. <br />
          This gives you a Collateralization Ratio (C-Ratio) and a debt,
          allowing you to earn weekly staking rewards.
        </>
      }
    >
      <PresetCRatioOptions
        value={targetCRatio}
        options={presetCratioOptions}
        onChange={setTargetCRatio}
      />
      <TokenPair
        mt={3}
        price={2}
        fromToken={fromToken}
        toToken={toToken}
        targetCRatio={targetCRatio}
        arrowImg={arrowImg}
      />
      <BalanceChange my={3} {...mockBalanceChange} />
      <Box>
        <PrimaryButton size='large' fullWidth>
          Mint Now
        </PrimaryButton>
      </Box>
    </PageCard>
  );
}
