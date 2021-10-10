import { Link } from "@mui/material";
import type { StakeCardProps } from "@components/StakeCard";
import { Token, TOKEN_ADDRESS, Action } from "@utils/constants";
import { COLOR } from "@utils/theme/constants";
import phbBg from "@assets/bgs/phb.png";
import hznBg from "@assets/bgs/hzn.png";
import busdBg from "@assets/bgs/busd.png";
import bnbBg from "@assets/bgs/bnb.png";
import phbLogo from "@assets/tokens/phb.png";
import bnbLogo from "@assets/tokens/bnb.png";
import cakeLogo from "@assets/tokens/cake.png";

export const AllPools: StakeCardProps[] = [
  {
    token: Token.PHB,
    bg: phbBg,
    color: "#FC4C07",
    logo: phbLogo,
    links: [
      {
        href: "https://www.binance.com/en/trade/PHB_BTC",
        logo: bnbLogo,
        text: "Buy PHB",
      },
    ],
    desc: (
      <>
        Stake PHB V2 to earn HZN.
        <br />
        To swap your existing PHB V1 tokens to PHB V2, click{" "}
        <Link
          color={COLOR.safe}
          underline='hover'
          fontWeight={700}
          href='https://horizonprotocol.medium.com/swap-guide-phx-nep5-phb-bep2-and-phb-bep20-f79c0d12135c'
          target='_blank'
        >
          here
        </Link>
        .
      </>
    ),
  },
  {
    token: Token.PHB_LEGACY,
    finished: true,
    bg: phbBg,
    color: "#FC4C07",
    logo: phbLogo,
    links: [
      {
        href: "https://www.binance.com/en/trade/PHB_BTC",
        logo: bnbLogo,
        text: "Buy PHB",
      },
    ],
    desc: (
      <>
        Stake BEP-20 PHB to earn HZN. <br />
        To convert your existing PHX or BEP-2 PHB to BEP-20 PHB, click{" "}
        <Link
          href='https://horizonprotocol.medium.com/swap-guide-phx-nep5-phb-bep2-and-phb-bep20-f79c0d12135c'
          target='_blank'
        >
          here
        </Link>
        .
      </>
    ),
  },
  {
    token: Token.HZN_BNB_LP,
    bg: bnbBg,
    color: "#D2884F",
    // open: false,
    // disabledActions: [Action.Stake],
    desc: (
      <>
        Stake HZN-BNB LPs to earn HZN. <br />
        You can provide liquidity on Pancakeswap to get HZN-BNB LP tokens.
      </>
    ),
    links: [
      {
        href: `https://pancakeswap.finance/add/BNB/${
          TOKEN_ADDRESS[56][Token.HZN]
        }`,
        logo: cakeLogo,
        text: "GET HZN-BNB LP TOKENS",
      },
    ],
  },
  {
    token: Token.ZUSD_BUSD_LP,
    bg: busdBg,
    color: "#D2884F",
    desc: (
      <>
        Stake zUSD-BUSD LPs to earn HZN. <br />
        You can provide liquidity on Pancakeswap to get zUSD-BUSD LP tokens.
      </>
    ),
    links: [
      {
        href: "https://pancakeswap.finance/add/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56/0xF0186490B18CB74619816CfC7FeB51cdbe4ae7b9",
        logo: cakeLogo,
        text: "GET zUSD-BUSD LP TOKENS",
      },
    ],
  },
  {
    token: Token.HZN,
    finished: true,
    bg: hznBg,
    // color: "#2AD4B7",
    // desc: (
    //   <>
    //     <br />
    //     Stake BEP-20 HZN to earn HZN. <br />
    //   </>
    // ),
    color: "#FF325F",
    cardTitle: "Please Unstake",
    disabledActions: [Action.Stake],
    desc: (
      <>
        This staking pool is no longer active, please unstake your HZN. You may
        stake your HZN by minting zUSD in the 'Mint' tab.
      </>
    ),
    links: [
      {
        href: `https://exchange.pancakeswap.finance/#/swap?outputCurrency=${
          TOKEN_ADDRESS[56][Token.HZN]
        }`,
        logo: cakeLogo,
        text: "Buy HZN",
      },
    ],
  },
  {
    token: Token.HZN_BNB_LP_LEGACY,
    finished: true,
    bg: bnbBg,
    color: "#FF325F",
    cardTitle: "Please Unstake",
    disabledActions: [Action.Stake],
    desc: (
      <>
        Due to the Pancakeswap migration, this pool is no longer active. Please
        unstake your tokens and go through the LP migration process{" "}
        <Link
          href='https://v1exchange.pancakeswap.finance/#/migrate'
          target='_blank'
        >
          here
        </Link>
        .
      </>
    ),
    links: [
      {
        href: "https://pancakeswap.medium.com/the-great-migration-vote-4093cb3edf23",
        logo: cakeLogo,
        text: "Pancakeswap v2 Migration",
      },
    ],
  },
];
