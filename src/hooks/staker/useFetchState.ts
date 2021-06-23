import { useCallback } from "react";
import { constants } from "ethers";
import { useUpdateAtom } from "jotai/utils";
import { useSnackbar } from "notistack";
import { loadingAllAtom } from "@atoms/staker/loading";
import { availableAtomFamily } from "@atoms/staker/balance";
import { Token } from "@utils/constants";
import { etherToBN } from "@utils/number";
import {
  usePHB,
  useHZN,
  useLP,
  useDeprecatedLP,
  useLegacyLP,
} from "../useContract";
import useWallet from "../useWallet";
import useStakingDataFetcher from "./useStakingDataFetcher";
import { useQuery } from "react-query";
import { EARN } from "@utils/queryKeys";

export default function useFetchState() {
  const { account } = useWallet();

  const { enqueueSnackbar } = useSnackbar();

  // token available
  const phbToken = usePHB();
  const hznToken = useHZN();
  const lpToken = useLP();
  const deprecatedLpToken = useDeprecatedLP();
  const legacyLpToken = useLegacyLP();

  // all loading
  const setLoading = useUpdateAtom(loadingAllAtom);

  // available atoms
  const setAvailablePHB = useUpdateAtom(availableAtomFamily(Token.PHB));
  const setAvailableHZN = useUpdateAtom(availableAtomFamily(Token.HZN));
  const setAvailableLP = useUpdateAtom(availableAtomFamily(Token.HZN_BNB_LP));
  const setAvailableDeprecatedLP = useUpdateAtom(
    availableAtomFamily(Token.HZN_BNB_LP_DEPRECATED)
  );
  const setAvailableLegacyLP = useUpdateAtom(
    availableAtomFamily(Token.HZN_BNB_LP_LEGACY)
  );

  // fetch token staking data
  const fetchPHBStakingData = useStakingDataFetcher(Token.PHB);
  const fetchHZNStakingData = useStakingDataFetcher(Token.HZN);
  const fetchLPStakingData = useStakingDataFetcher(Token.HZN_BNB_LP);
  const fetchDeprecatedLPStakingData = useStakingDataFetcher(
    Token.HZN_BNB_LP_DEPRECATED
  );
  const fetchLegacyLPStakingData = useStakingDataFetcher(
    Token.HZN_BNB_LP_LEGACY
  );

  const fetcher = useCallback(async () => {
    try {
      setLoading(true);
      const [phb, hzn, lp, deprecatedLp, legacyLp] = await Promise.all([
        account && phbToken ? phbToken.balanceOf(account) : constants.Zero,
        account && hznToken
          ? hznToken.transferableSynthetix(account)
          : constants.Zero,
        account && lpToken ? lpToken.balanceOf(account) : constants.Zero,
        account && deprecatedLpToken
          ? deprecatedLpToken.balanceOf(account)
          : constants.Zero,
        account && legacyLpToken
          ? legacyLpToken.balanceOf(account)
          : constants.Zero,
        fetchPHBStakingData(),
        fetchHZNStakingData(),
        fetchLPStakingData(),
        fetchDeprecatedLPStakingData(),
        fetchLegacyLPStakingData(),
      ]);

      setAvailablePHB(etherToBN(phb));
      setAvailableHZN(etherToBN(hzn));
      setAvailableLP(etherToBN(lp));
      setAvailableDeprecatedLP(etherToBN(deprecatedLp));
      setAvailableLegacyLP(etherToBN(legacyLp));
    } catch (e) {
      console.log(e);
      enqueueSnackbar("Failed to loading balances", { variant: "error" });
    }
    setLoading(false);
  }, [
    setLoading,
    account,
    phbToken,
    hznToken,
    lpToken,
    deprecatedLpToken,
    legacyLpToken,
    fetchPHBStakingData,
    fetchHZNStakingData,
    fetchLPStakingData,
    fetchDeprecatedLPStakingData,
    fetchLegacyLPStakingData,
    setAvailablePHB,
    setAvailableHZN,
    setAvailableLP,
    setAvailableDeprecatedLP,
    setAvailableLegacyLP,
    enqueueSnackbar,
  ]);

  useQuery([EARN, account, "state"], fetcher, {
    enabled: !!account,
  });
}
