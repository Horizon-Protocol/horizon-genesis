import { useCallback } from "react";
import { useUpdateAtom } from "jotai/utils";
import { BigNumber, constants } from "ethers";
import { tokenStatAtomFamily } from "@atoms/stat";
import { BSC_BLOCK_TIME, Token } from "@utils/constants";
import { useRpcStaking } from "./useStaking";
import useFetchPrice from "./useFetchPrice";

export function useFetchStat(token: TokenEnum) {
  const stakingContract = useRpcStaking(token);

  // stat
  const setStat = useUpdateAtom(tokenStatAtomFamily(token));

  const fetchData = useCallback(async () => {
    let res: BigNumber[] = [];
    if (stakingContract) {
      res = await Promise.all([
        stakingContract.totalSupply(), // total staked
        stakingContract.periodFinish(), // finish time
        stakingContract.rewardRate(), // rewards per second
        // stakingContract.rewardsDuration(), // rewardDuration in seconds
        stakingContract.lockDownDuration(), // lockDownDuration in seconds
      ]);
    }
    const [
      totalStaked = constants.Zero,
      periodFinish = constants.Zero,
      rewardsPerSecond = constants.Zero,
      // rewardsDurationSeconds = constants.Zero,
      lockDownSeconds = constants.Zero,
    ] = res;
    const finishTimestamp = periodFinish.toNumber();
    const now = Date.now() / 1000;
    setStat({
      isRoundActive: finishTimestamp > 0 && now < finishTimestamp,
      total: totalStaked,
      rewardsPerBlock: rewardsPerSecond.mul(BSC_BLOCK_TIME),
      // rewardsDurationSeconds,
      lockDownSeconds,
    });
    return constants.Zero;
  }, [setStat, stakingContract]);

  return fetchData;
}

export default function useFetchStats() {
  const phb = useFetchStat(Token.PHB);
  const hzn = useFetchStat(Token.HZN);
  const lp = useFetchStat(Token.HZN_BNB_LP);
  const lpDeprecated = useFetchStat(Token.HZN_BNB_LP_DEPRECATED);
  const lpLegacy = useFetchStat(Token.HZN_BNB_LP_LEGACY);

  // price
  const fetchPrice = useFetchPrice();

  const fetch = useCallback(
    () =>
      Promise.all([
        fetchPrice(),
        phb(),
        hzn(),
        lp(),
        lpDeprecated(),
        lpLegacy(),
      ]),
    [fetchPrice, phb, hzn, lp, lpDeprecated, lpLegacy]
  );

  return fetch;
}
