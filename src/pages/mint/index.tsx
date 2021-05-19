import bgMint from "@assets/images/mint.png";
import PageCard from "@components/PageCard";

const THEME_COLOR = "#2AD4B7";

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
      Mint Content
    </PageCard>
  );
}
