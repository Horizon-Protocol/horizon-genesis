import { useState } from "react";
import { PAGE_COLOR } from "@utils/theme/constants";
import bgMint from "@assets/images/mint.png";
import arrowImg from "@assets/images/arrow-mint.png";
import PageCard from "@components/PageCard";
import TargetCRatioOptions from "@components/TargetCRatioOptions";
import TokenPair, { TokenProps } from "@components/TokenPair";
import { Token } from "@utils/constants";
import { BigNumber } from "@ethersproject/bignumber";
import { zAssets } from "@utils/zAssets";

const THEME_COLOR = PAGE_COLOR.mint;

const targetCratioOptions: TargetCRatioOption[] = [
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
    amount: BigNumber.from(0),
    max: BigNumber.from(100),
    maxButtonLabel: "Max Mint",
    color: THEME_COLOR,
  };

  const toToken: TokenProps = {
    token: zAssets.zUSD,
    label: "Mint",
    color: THEME_COLOR,
    bgColor: "#0A1624",
    amount: BigNumber.from(0),
    balanceLabel: "Minted at 700% C-Ratio",
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
      <TargetCRatioOptions
        value={targetCRatio}
        options={targetCratioOptions}
        onChange={setTargetCRatio}
      />
      <TokenPair
        mt={3}
        fromToken={fromToken}
        toToken={toToken}
        arrowImg={arrowImg}
      />
    </PageCard>
  );
}
