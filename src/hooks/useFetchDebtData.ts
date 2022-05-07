import { useCallback } from "react";
import { BigNumber, Contract } from "ethers";
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

  const fetcher = useCallback<() => Promise<[number, BN[]]>>(async () => {
    const {
      contracts: { Synthetix, RewardEscrowV2, Liquidations },
      utils,
    } = horizon.js!;
    // console.log("====contracts====",utils)

    const zUSDBytes = utils.formatBytes32String("zUSD");
    const [deadline, ...values] = (await Promise.all([
      Liquidations.getLiquidationDeadlineForAccount(account),
      Synthetix.collateral(account),
      Synthetix.collateralisationRatio(account),
      Synthetix.transferableSynthetix(account),
      Synthetix.debtBalanceOf(account, zUSDBytes),
      Synthetix.maxIssuableSynths(account),
      Synthetix.balanceOf(account),
      RewardEscrowV2.balanceOf(account),
    ])) as BigNumber[];
    return [deadline.toNumber(), values.map((item) => etherToBN(item))];
  }, [account]);

  useQuery([CONTRACT, account, "debt"], fetcher, {
    enabled: !!account && !!horizon.js,
    onSuccess([
      liquidationDeadline,
      [
        collateral,
        currentCRatio,
        transferable,
        debtBalance,
        issuableSynths,
        balance,
        escrowedReward,
      ],
    ]) {
      console.log("===debtData===", {
        currentCRatio: currentCRatio.toNumber(),
        transferable: transferable.toString(),
        debtBalance: debtBalance.toString(),
        collateral: collateral.toString(),
        issuableSynths: issuableSynths.toString(),
        balance: balance.toString(),
        escrowedReward: escrowedReward.toString(),
        liquidationDeadline,
      });
      setDebtData({
        currentCRatio,
        transferable,
        debtBalance,
        collateral,
        issuableSynths,
        balance,
        escrowedReward,
        liquidationDeadline,
      });
    },
  });
}
