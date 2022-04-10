import { Link } from "@mui/material";
import type { StakeCardProps } from "@components/StakeCard";
import { Token, TOKEN_ADDRESS } from "@utils/constants";
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
          underline="hover"
          fontWeight={700}
          href="https://staker.phoenix.global/swap"
          target="_blank"
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
    desc: (
      <>
        The PHB token has migrated to a new PHB V2 token and all rewards for
        this pool have ended. Read more{" "}
        <Link href="https://staker.phoenix.global/swap" target="_blank">
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
    color: "#2AD4B7",
    desc: (
      <>
        This staking pool is no longer active, please unstake your HZN. You may
        stake your HZN by minting zUSD in the &#39;Mint&#39; tab.
      </>
    ),
  },
  {
    token: Token.HZN_BNB_LP_LEGACY,
    finished: true,
    bg: bnbBg,
    color: "#D2884F",
    desc: (
      <>
        Due to the Pancakeswap migration, please unstake your tokens and go
        through the LP migration process{" "}
        <Link
          href="https://v1exchange.pancakeswap.finance/#/migrate"
          target="_blank"
        >
          here
        </Link>
        .
      </>
    ),
  },
];
