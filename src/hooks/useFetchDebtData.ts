import useRequest from "@ahooksjs/use-request";
import horizon from "@lib/horizon";
import useWallet from "./useWallet";

interface Params {}

export default function useFetchDebtData(params: Params) {
  const { account } = useWallet();

  useRequest(
    async () => {
      const {
        contracts: { SystemSettings, Synthetix },
        utils,
      } = horizon.js!;
      const zUSDBytes = utils.formatBytes32String("zUSD");
      const result = await Promise.all([
        SystemSettings.issuanceRatio(),
        Synthetix.collateralisationRatio(account),
        Synthetix.transferableSynthetix(account),
        Synthetix.debtBalanceOf(account, zUSDBytes),
        Synthetix.collateral(account),
        Synthetix.maxIssuableSynths(account),
        Synthetix.balanceOf(account),
        Synthetix.totalSupply(),
      ]);
      const [
        targetCRatio,
        currentCRatio,
        transferable,
        debtBalance,
        collateral,
        issuableSynths,
        balance,
        totalSupply,
      ] = result.map((item) => utils.formatEther(item));

      console.log({
        targetCRatio,
        currentCRatio,
        transferable,
        debtBalance,
        collateral,
        issuableSynths,
        balance,
        totalSupply,
      });
    },
    {
      ready: !!account && !!horizon.js,
    }
  );
}
