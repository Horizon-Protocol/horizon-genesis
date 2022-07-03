import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import { getApy } from "@utils/apy";
import { marketPricesAtom } from "./price";
import { StakingAddresses, Token, TokenAddresses } from "@utils/constants";
import { zeroBN } from "@utils/number";

export interface FarmConf {
  name: TokenEnum;
  address: string;
  token0?: string; // if LP farm
  token0Name: keyof MarketPrices; // if LP farm or address if not
  token1?: string; // if LP farm
  token1Name?: keyof MarketPrices; // if LP farm
  staking: string; // staking contract address
}

export const Farms: FarmConf[] = [
  {
    name: Token.HZN_BNB_LP,
    address: TokenAddresses[Token.HZN_BNB_LP],
    token0: TokenAddresses[Token.WBNB], // WBNB
    token0Name: "WBNB",
    token1: TokenAddresses[Token.HZN], // HZN
    token1Name: "HZN",
    staking: StakingAddresses[Token.HZN_BNB_LP],
  },
  {
    name: Token.ZUSD_BUSD_LP,
    address: TokenAddresses[Token.ZUSD_BUSD_LP],
    token0: TokenAddresses[Token.BUSD], // BUSD
    token0Name: "BUSD",
    token1: TokenAddresses[Token.ZUSD], // ZUSD
    token1Name: "zUSD",
    staking: StakingAddresses[Token.ZUSD_BUSD_LP],
  },
  {
    name: Token.ZBNB_BNB_LP,
    address: TokenAddresses[Token.ZBNB_BNB_LP],
    token0: TokenAddresses[Token.BNB], // BNB
    token0Name: "BNB",
    token1: TokenAddresses[Token.ZBNB], // zBNB
    token1Name: "zBNB",
    staking: StakingAddresses[Token.ZBNB_BNB_LP],
  },
  {
    name: Token.PHB,
    address: TokenAddresses[Token.PHB],
    token0Name: "PHB",
    staking: StakingAddresses[Token.PHB],
  },
  {
    name: Token.PHB_LEGACY,
    address: TokenAddresses[Token.PHB_LEGACY],
    token0Name: "PHB",
    staking: StakingAddresses[Token.PHB_LEGACY],
  },
  {
    name: Token.HZN,
    address: TokenAddresses[Token.HZN],
    token0Name: "HZN",
    staking: StakingAddresses[Token.HZN],
  },
  {
    name: Token.HZN_BNB_LP_LEGACY,
    address: TokenAddresses[Token.HZN_BNB_LP_LEGACY],
    token0: TokenAddresses[Token.WBNB], // WBNB
    token0Name: "WBNB", // WBNB
    token1: TokenAddresses[Token.HZN], // HZN
    token1Name: "HZN", // HZN
    staking: StakingAddresses[Token.HZN_BNB_LP_LEGACY],
  },
];

export interface FarmData
  extends Pick<FarmConf, "name" | "token0Name" | "token1Name"> {
  isRoundActive: boolean;
  lockDownSeconds: number;
  total: number;
  totalStaked: number;
  rewards: number;
  rewardsPerSecond: number;

  // LP
  token0Balance: number;
  token1Balance: number;

  // account
  allowance?: BN;
  available: BN;
  withdrawable: BN;
  staked: number;
  earned: number;
}

export const farmsAtom = atom<FarmData[]>([]);

export interface FarmInfo {
  isRoundActive: boolean;
  lockDownSeconds: number;
  totalStaked: number;
  price: number;
  weeklyRewards: number;
  apy: number;
}
export const farmInfoFamilyAtom = atomFamily((token) =>
  atom((get) => {
    const marketPrices = get(marketPricesAtom);
    const farmData = get(farmsAtom).find(({ name }) => name === token);
    if (!farmData) {
      return {
        lockDownSeconds: 0,
        price: 0,
        weeklyRewards: 0,
        totalStaked: 0,
        apy: 0,
      };
    }
    const {
      lockDownSeconds,
      isRoundActive,
      token0Name,
      token1Name,
      token0Balance,
      token1Balance,
      total,
      totalStaked,
      rewards,
      rewardsPerSecond,
    } = farmData;

    const hznMarketPrice = marketPrices.HZN || 0;
    const weeklyRewards = hznMarketPrice * rewards;

    const token0Price = marketPrices?.[token0Name] || 0;

    if (token1Name) {
      const token1Price = marketPrices[token1Name] || 0;
      const lpTotalValue =
        token0Price * token0Balance! + token1Price * token1Balance!;
      const lpPrice = lpTotalValue / total;

      const apy = isRoundActive
        ? getApy(lpPrice, hznMarketPrice, totalStaked, rewardsPerSecond)
        : 0;

      return {
        price: lpPrice,
        weeklyRewards,
        totalStaked,
        apy,
        lockDownSeconds,
        isRoundActive,
      };
    }

    const apy = isRoundActive
      ? getApy(token0Price, hznMarketPrice, totalStaked, rewardsPerSecond)
      : 0;

    return {
      price: token0Price,
      weeklyRewards: 0,
      totalStaked,
      apy,
      lockDownSeconds,
      isRoundActive,
    };
  })
);

// export const hznInLpAtom = selectAtom(farmsAtom, (farms) => {
//   const farmBnbHzn = find(farms, { name: "HZN-BNB LP" });
//   return farmBnbHzn?.token1Balance;
// });

export interface UserFarmInfo {
  allowance?: BN;
  available: BN;
  withdrawable: BN;
  earned: number;
  staked: number;
}
export const userFarmInfoFamilyAtom = atomFamily((token) =>
  atom((get) => {
    const farmData = get(farmsAtom).find(({ name }) => name === token);
    if (!farmData) {
      return {
        allowance: undefined,
        available: zeroBN,
        withdrawable: zeroBN,
        staked: 0,
        earned: 0,
      };
    }
    const { allowance, available, staked, earned, withdrawable } = farmData;

    return {
      allowance,
      available,
      withdrawable,
      staked,
      earned,
    };
  })
);
