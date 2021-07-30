import { useCallback } from "react";
import { useQuery } from "react-query";
import { useUpdateAtom } from "jotai/utils";
import { BigNumber } from "ethers";
import { tokenStatAtomFamily } from "@atoms/staker/stat";
import { BSC_BLOCK_TIME, Token } from "@utils/constants";
import { etherToBN, toBN } from "@utils/number";
import { EARN, PUBLIC } from "@utils/queryKeys";
import { useMultiCallStaking } from "./useStaking";

export function useStatFetcher(token: TokenEnum) {
  const { contract: stakingContract, getProvider: getMultiCallProvider } =
    useMultiCallStaking(token);

  // stat
  const setStat = useUpdateAtom(tokenStatAtomFamily(token));

  const fetchData = useCallback(async () => {
    if (stakingContract) {
      const multiCallProvider = await getMultiCallProvider();

      const res = (await multiCallProvider.all([
        stakingContract.totalSupply(), // total staked
        stakingContract.periodFinish(), // finish time
        stakingContract.rewardRate(), // rewards per second
        // stakingContract.rewardsDuration(), // rewardDuration in seconds
        stakingContract.lockDownDuration(), // lockDownDuration in seconds
      ])) as BigNumber[];

      const [
        totalStaked,
        periodFinish,
        rewardsPerSecond,
        // rewardsDurationSeconds,
        lockDownSeconds,
      ] = res;
      const finishTimestamp = periodFinish.toNumber();
      const now = Date.now() / 1000;
      setStat({
        isRoundActive: finishTimestamp > 0 && now < finishTimestamp,
        total: etherToBN(totalStaked),
        rewardsPerBlock:
          etherToBN(rewardsPerSecond).multipliedBy(BSC_BLOCK_TIME),
        // rewardsDurationSeconds,
        lockDownSeconds: toBN(lockDownSeconds.toString()),
      });
    }
  }, [getMultiCallProvider, setStat, stakingContract]);

  return fetchData;
}

export default function useFetchStats() {
  const phb = useStatFetcher(Token.PHB);
  const hzn = useStatFetcher(Token.HZN);
  const zUSDlp = useStatFetcher(Token.ZUSD_BUSD_LP);
  const lp = useStatFetcher(Token.HZN_BNB_LP);
  const lpLegacy = useStatFetcher(Token.HZN_BNB_LP_LEGACY);

  const fetcher = useCallback(
    () => Promise.all([phb(), hzn(), zUSDlp(), lp(), lpLegacy()]),
    [hzn, zUSDlp, lp, lpLegacy, phb]
  );

  useQuery([EARN, PUBLIC, "stats"], fetcher);
}
