import { useRequest } from "ahooks";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import horizon from "@lib/horizon";
import { toBigNumber } from "@utils/number";
import { needRefreshAtom } from "@atoms/app";
import { debtAtom } from "@atoms/debt";
import useWallet from "./useWallet";

export default function useFetchDebtData() {
  const needRefresh = useAtomValue(needRefreshAtom);
  const { account } = useWallet();

  const setDebtData = useUpdateAtom(debtAtom);

  useRequest(
    async () => {
      console.log("load debt data");
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
      return res.map((item) => toBigNumber(utils.formatEther(item)));
    },
    {
      ready: !!account && !!horizon.js,
      refreshDeps: [needRefresh],
      onSuccess([
        collateral,
        currentCRatio,
        transferable,
        debtBalance,
        issuableSynths,
        balance,
        escrowedReward,
        liquidationDeadline,
      ]) {
        console.log({
          currentCRatio,
          transferable,
          debtBalance,
          collateral,
          issuableSynths,
          balance,
          escrowedReward,
          liquidationDeadline: liquidationDeadline.toString(),
        });
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
    }
  );
}
