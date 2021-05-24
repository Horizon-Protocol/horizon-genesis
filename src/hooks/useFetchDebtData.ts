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
        contracts: { SystemSettings, Synthetix, Liquidations },
        utils,
      } = horizon.js!;
      const zUSDBytes = utils.formatBytes32String("zUSD");
      const res: BigNumber[] = await Promise.all([
        SystemSettings.issuanceRatio(),
        Synthetix.collateralisationRatio(account),
        Synthetix.transferableSynthetix(account),
        Synthetix.debtBalanceOf(account, zUSDBytes),
        Synthetix.collateral(account),
        Synthetix.maxIssuableSynths(account),
        Synthetix.balanceOf(account),
        Synthetix.totalSupply(),
        Liquidations.liquidationRatio(),
        Liquidations.liquidationDelay(),
        Liquidations.getLiquidationDeadlineForAccount(account),
      ]);
      return res;
    },
    {
      ready: !!account && !!horizon.js,
      onSuccess([
        targetCRatio,
        currentCRatio,
        transferable,
        debtBalance,
        collateral,
        issuableSynths,
        balance,
        totalSupply,
        liquidationRatio,
        liquidationDelay,
        liquidationDeadline,
      ]) {
        console.log({
          targetCRatio,
          currentCRatio,
          transferable,
          debtBalance,
          collateral,
          issuableSynths,
          balance,
          totalSupply,
          liquidationRatio: liquidationRatio.toString(),
          liquidationDelay: liquidationDelay.toString(),
          liquidationDeadline: liquidationDeadline.toString(),
        });
        setDebtData({
          currentCRatio,
          targetCRatio,
          liquidationRatio,
          transferable,
          debtBalance,
          collateral,
          issuableSynths,
          balance,
          totalSupply,
        });
      },
    }
  );
}
