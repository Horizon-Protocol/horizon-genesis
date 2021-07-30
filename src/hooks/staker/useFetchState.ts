import { useCallback } from "react";
import { constants } from "ethers";
import { useUpdateAtom } from "jotai/utils";
import { useSnackbar } from "notistack";
import { loadingAllAtom } from "@atoms/staker/loading";
import { availableAtomFamily } from "@atoms/staker/balance";
import { Token } from "@utils/constants";
import { etherToBN } from "@utils/number";
import { usePHB, useHZN, useZUSDLP, useLP, useLegacyLP } from "../useContract";
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
  const zUSDLpToken = useZUSDLP();
  const lpToken = useLP();
  const legacyLpToken = useLegacyLP();

  // all loading
  const setLoading = useUpdateAtom(loadingAllAtom);

  // available atoms
  const setAvailablePHB = useUpdateAtom(availableAtomFamily(Token.PHB));
  const setAvailableHZN = useUpdateAtom(availableAtomFamily(Token.HZN));
  const setAvailableLpZUSD = useUpdateAtom(
    availableAtomFamily(Token.ZUSD_BUSD_LP)
  );
  const setAvailableLP = useUpdateAtom(availableAtomFamily(Token.HZN_BNB_LP));
  const setAvailableLegacyLP = useUpdateAtom(
    availableAtomFamily(Token.HZN_BNB_LP_LEGACY)
  );

  // fetch token staking data
  const fetchPHBStakingData = useStakingDataFetcher(Token.PHB);
  const fetchHZNStakingData = useStakingDataFetcher(Token.HZN);
  const fetchZUSDLPStakingData = useStakingDataFetcher(Token.ZUSD_BUSD_LP);
  const fetchLPStakingData = useStakingDataFetcher(Token.HZN_BNB_LP);

  const fetchLegacyLPStakingData = useStakingDataFetcher(
    Token.HZN_BNB_LP_LEGACY
  );

  const fetcher = useCallback(async () => {
    try {
      setLoading(true);
      fetchPHBStakingData();
      fetchHZNStakingData();
      fetchZUSDLPStakingData();
      fetchLPStakingData();
      fetchLegacyLPStakingData();
      const [phb, hzn, zUSDLp, lp, legacyLp] = await Promise.all([
        account && phbToken ? phbToken.balanceOf(account) : constants.Zero,
        account && hznToken
          ? hznToken.transferableSynthetix(account)
          : constants.Zero,
        account && zUSDLpToken
          ? zUSDLpToken.balanceOf(account)
          : constants.Zero,
        account && lpToken ? lpToken.balanceOf(account) : constants.Zero,
        account && legacyLpToken
          ? legacyLpToken.balanceOf(account)
          : constants.Zero,
      ]);

      setAvailablePHB(etherToBN(phb));
      setAvailableHZN(etherToBN(hzn));
      setAvailableLpZUSD(etherToBN(zUSDLp));
      setAvailableLP(etherToBN(lp));
      setAvailableLegacyLP(etherToBN(legacyLp));
    } catch (e) {
      console.log(e);
      enqueueSnackbar("Failed to loading balances", { variant: "error" });
    }
    setLoading(false);
  }, [
    setLoading,
    fetchPHBStakingData,
    fetchHZNStakingData,
    fetchZUSDLPStakingData,
    fetchLPStakingData,
    fetchLegacyLPStakingData,
    account,
    phbToken,
    hznToken,
    zUSDLpToken,
    lpToken,
    legacyLpToken,
    setAvailablePHB,
    setAvailableHZN,
    setAvailableLpZUSD,
    setAvailableLP,
    setAvailableLegacyLP,
    enqueueSnackbar,
  ]);

  useQuery([EARN, account, "state"], fetcher, {
    enabled: !!account,
  });
}
