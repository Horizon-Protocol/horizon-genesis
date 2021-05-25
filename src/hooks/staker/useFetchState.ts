import { useCallback } from "react";
import { constants } from "ethers";
import { useUpdateAtom } from "jotai/utils";
import { useSnackbar } from "notistack";
import { loadingAllAtom } from "@atoms/staker/loading";
import { availableAtomFamily } from "@atoms/staker/balance";
import { Token } from "@utils/constants";
import {
  usePHB,
  useHZN,
  useLP,
  useDeprecatedLP,
  useLegacyLP,
} from "../useContract";
import useWallet from "../useWallet";
import useFetchStakingData from "./useFetchStakingData";

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
  const fetchPHBStakingData = useFetchStakingData(Token.PHB);
  const fetchHZNStakingData = useFetchStakingData(Token.HZN);
  const fetchLPStakingData = useFetchStakingData(Token.HZN_BNB_LP);
  const fetchDeprecatedLPStakingData = useFetchStakingData(
    Token.HZN_BNB_LP_DEPRECATED
  );
  const fetchLegacyLPStakingData = useFetchStakingData(Token.HZN_BNB_LP_LEGACY);

  const fetchBalances = useCallback(async () => {
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

      setAvailablePHB(phb);
      setAvailableHZN(hzn);
      setAvailableLP(lp);
      setAvailableDeprecatedLP(deprecatedLp);
      setAvailableLegacyLP(legacyLp);
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

  return fetchBalances;
}
