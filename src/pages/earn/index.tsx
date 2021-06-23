import { makeStyles } from "@material-ui/core/styles";
import { Link } from "@material-ui/core";
import StakeCard, { StakeCardProps } from "@components/StakeCard";
import { Token, TOKEN_ADDRESS, Action } from "@utils/constants";
import useFetchPrice from "@hooks/staker/useFetchPrice";
import useFetchStats from "@hooks/staker/useFetchStats";
import useFetchState from "@hooks/staker/useFetchState";
import phbBg from "@assets/bgs/phb.png";
import hznBg from "@assets/bgs/hzn.png";
import bnbBg from "@assets/bgs/bnb.png";
import phbLogo from "@assets/tokens/phb.png";
import bnbLogo from "@assets/tokens/bnb.png";
import cakeLogo from "@assets/tokens/cake.png";

const useStyles = makeStyles({
  container: {
    padding: "6vh 24px 24px",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  card: {
    margin: 10,
  },
});

const cards: StakeCardProps[] = [
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
    token: Token.HZN,
    bg: hznBg,
    color: "#2AD4B7",
    desc: (
      <>
        <br />
        Stake BEP-20 HZN to earn HZN. <br />
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
        href: `https://exchange.pancakeswap.finance/#/add/BNB/${
          TOKEN_ADDRESS[56][Token.HZN]
        }`,
        logo: cakeLogo,
        text: "GET HZN-BNB LP TOKENS",
      },
    ],
  },
  {
    token: Token.HZN_BNB_LP_DEPRECATED,
    bg: bnbBg,
    color: "#FF325F",
    // open: false,
    cardTitle: "Please Unstake",
    disabledActions: [Action.Stake],
    desc: (
      <>
        This pool is disabled, please unstake immediately. To transfer your
        discontinued LP to the updated LP, click here.
      </>
    ),
    links: [
      {
        href: "https://pancakeswap.medium.com/the-great-migration-vote-4093cb3edf23",
        logo: cakeLogo,
        text: "Pancakeswap v2 Migration",
      },
      // {
      //   href: `https://exchange.pancakeswap.finance/#/add/BNB/${
      //     TOKEN_ADDRESS[56][Token.HZN]
      //   }`,
      //   logo: cakeLogo,
      //   text: "GET HZN-BNB LP TOKENS",
      // },
    ],
  },
  {
    token: Token.HZN_BNB_LP_LEGACY,
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

export default function Home() {
  const classes = useStyles();

  useFetchPrice();
  useFetchStats();
  useFetchState();

  return (
    <div className={classes.container}>
      {cards.map((card) => (
        <StakeCard key={card.token} {...card} className={classes.card} />
      ))}
    </div>
  );
}
