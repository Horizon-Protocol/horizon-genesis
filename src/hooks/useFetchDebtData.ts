import { useCallback } from "react";
import { useQuery } from "react-query";
import { useResetAtom, useUpdateAtom } from "jotai/utils";
import horizon from "@lib/horizon";
import { etherToBN } from "@utils/number";
import { CONTRACT } from "@utils/queryKeys";
import { debtAtom, resetDebtAtom } from "@atoms/debt";
import useWallet from "./useWallet";
import useDisconnected from "./useDisconnected";

export default function useFetchDebtData() {
  const { account } = useWallet();

  const setDebtData = useUpdateAtom(debtAtom);
  const resetDebtData = useResetAtom(resetDebtAtom);

  useDisconnected(resetDebtData);

  const fetcher = useCallback(async () => {
    const {
      contracts: { Synthetix, RewardEscrow, Liquidations },
      utils,
    } = horizon.js!;

    const zUSDBytes = utils.formatBytes32String("zUSD");
    const res = await Promise.all([
      Synthetix.collateral(account),
      Synthetix.collateralisationRatio(account),
      Synthetix.transferableSynthetix(account),
      Synthetix.debtBalanceOf(account, zUSDBytes),
      Synthetix.maxIssuableSynths(account),
      Synthetix.balanceOf(account),
      RewardEscrow.balanceOf(account),
      Liquidations.getLiquidationDeadlineForAccount(account),
    ]);
    return res.map((item) => etherToBN(item));
  }, [account]);

  useQuery([CONTRACT, account, "debt"], fetcher, {
    enabled: !!account && !!horizon.js,
    onSuccess([
      collateral,
      currentCRatio,
      transferable,
      debtBalance,
      issuableSynths,
      balance,
      escrowedReward,
      // liquidationDeadline,
    ]) {
      // console.log({
      //   currentCRatio,
      //   transferable,
      //   debtBalance,
      //   collateral,
      //   issuableSynths,
      //   balance,
      //   escrowedReward,
      //   liquidationDeadline: liquidationDeadline.toString(),
      // });
      setDebtData({
        currentCRatio,
        transferable,
        debtBalance,
        collateral,
        issuableSynths,
        balance,
        escrowedReward,
      });
    },
  });
}
