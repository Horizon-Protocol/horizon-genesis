import { useRequest } from "ahooks";
import { useUpdateAtom } from "jotai/utils";
import { debtAtom } from "@atoms/debt";
import horizon from "@lib/horizon";
import useWallet from "./useWallet";
import { BigNumber } from "@ethersproject/bignumber";

interface Params {}

export default function useFetchDebtData(params: Params) {
  const { account } = useWallet();

  const setDebtData = useUpdateAtom(debtAtom);

  useRequest(
    async () => {
      const {
        contracts: { Synthetix, Liquidations },
        utils,
      } = horizon.js!;
      const zUSDBytes = utils.formatBytes32String("zUSD");
      const res: BigNumber[] = await Promise.all([
        Synthetix.collateralisationRatio(account),
        Synthetix.transferableSynthetix(account),
        Synthetix.debtBalanceOf(account, zUSDBytes),
        Synthetix.collateral(account),
        Synthetix.maxIssuableSynths(account),
        Synthetix.balanceOf(account),
        Liquidations.getLiquidationDeadlineForAccount(account),
      ]);
      return res;
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
        liquidationDeadline,
      ]) {
        console.log({
          currentCRatio,
          transferable,
          debtBalance,
          collateral,
          issuableSynths,
          balance,
          liquidationDeadline: liquidationDeadline.toString(),
        });
        setDebtData({
          currentCRatio,
          transferable,
          debtBalance,
          collateral,
          issuableSynths,
          balance,
        });
      },
    }
  );
}
