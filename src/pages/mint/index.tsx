import { PAGE_COLOR } from "@/utils/theme/constants";
import bgMint from "@assets/images/mint.png";
import PageCard from "@components/PageCard";
import TargetCRatioOption from "@components/TargetCRatioOption";

const THEME_COLOR = PAGE_COLOR.mint;

export default function Earn() {
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
      <TargetCRatioOption color={THEME_COLOR} title='test' percent={1000} />
    </PageCard>
  );
}
