import { useRequest } from "ahooks";
import { useUpdateAtom } from "jotai/utils";
import horizon from "@lib/horizon";
import { toBigNumber } from "@utils/number";
import { debtAtom } from "@atoms/debt";
import useWallet from "./useWallet";

export default function useFetchDebtData() {
  const { account } = useWallet();

  const setDebtData = useUpdateAtom(debtAtom);

  useRequest(
    async () => {
      const {
        contracts: { Synthetix, RewardEscrow, Liquidations },
        utils,
      } = horizon.js!;

      const zUSDBytes = utils.formatBytes32String("zUSD");
      const res = await Promise.all([
        Synthetix.collateralisationRatio(account),
        Synthetix.transferableSynthetix(account),
        Synthetix.debtBalanceOf(account, zUSDBytes),
        Synthetix.collateral(account),
        Synthetix.maxIssuableSynths(account),
        Synthetix.balanceOf(account),
        RewardEscrow.totalEscrowedAccountBalance(account),
        Liquidations.getLiquidationDeadlineForAccount(account),
      ]);
      return res.map((item) => toBigNumber(utils.formatEther(item)));
    },
    {
      ready: !!account && !!horizon.js,
      onSuccess([
        currentCRatio,
        transferable,
        debtBalance,
        collateral,
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
