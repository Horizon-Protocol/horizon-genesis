import { useCallback } from "react";
import { addSeconds, differenceInSeconds } from "date-fns";
import horizon from "@lib/horizon";
import useWallet from "./useWallet";

export default function useFetchBurnStatus() {
  const { account } = useWallet();

  const getMaxSecsLeftInWaitingPeriod = useCallback(async () => {
    const {
      contracts: { Exchanger },
      utils: { formatBytes32String },
    } = horizon.js!;

    try {
      const maxSecsLeftInWaitingPeriod =
        await Exchanger.maxSecsLeftInWaitingPeriod(
          account,
          formatBytes32String("sUSD")
        );
      return Number(maxSecsLeftInWaitingPeriod);
    } catch (e) {
      console.log(e);
    }
  }, [account]);

  const getIssuanceDelay = useCallback(async () => {
    const {
      contracts: { Issuer },
    } = horizon.js!;

    try {
      const [canBurnSynths, lastIssueEvent, minimumStakeTime] =
        await Promise.all([
          Issuer.canBurnSynths(account),
          Issuer.lastIssueEvent(account),
          Issuer.minimumStakeTime(),
        ]);

      if (Number(lastIssueEvent) && Number(minimumStakeTime)) {
        const burnUnlockDate = addSeconds(
          Number(lastIssueEvent) * 1000,
          Number(minimumStakeTime)
        );
        const issuanceDelayInSeconds = differenceInSeconds(
          burnUnlockDate,
          new Date()
        );
        return issuanceDelayInSeconds > 0
          ? issuanceDelayInSeconds
          : canBurnSynths
          ? 0
          : 1;
      }
    } catch (e) {
      console.log(e);
    }
  }, [account]);

  const fetchData = useCallback(async () => {
    const [waitingPeriod, issuanceDelay] = await Promise.all([
      getMaxSecsLeftInWaitingPeriod(),
      getIssuanceDelay(),
    ]);
    return {
      waitingPeriod,
      issuanceDelay,
    };
  }, [getMaxSecsLeftInWaitingPeriod, getIssuanceDelay]);

  return fetchData;
}
