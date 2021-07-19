import { useCallback, useMemo } from "react";
import { useSnackbar } from "notistack";
import horizon from "@lib/horizon";
import useWallet from "@hooks/useWallet";
import useRefresh from "@hooks/useRefresh";
import ActionLink from "./ActionLink";
import BaseAlert from "./Base";
import { formatCRatioToPercent } from "@utils/number";

interface Props {
  targetRatio: BN;
  liquidationDeadline: number;
}

export default function AboveTarget({
  targetRatio,
  liquidationDeadline,
}: Props) {
  const { account } = useWallet();
  const { enqueueSnackbar } = useSnackbar();
  const refresh = useRefresh();

  const { content } = useMemo(() => {
    if (liquidationDeadline > 0) {
      return {
        content: `Your account has flagged for liquidation, but you will not be liquidated at current c-ratio. Once your c-ratio is below ${formatCRatioToPercent(
          targetRatio
        )}%, you may be liquidated.`,
      };
    }
    return {
      content:
        "Your C-Ratio is above the target. You can mint more zUSD to lower your C-ratio and earn more rewards, but increase your risk from the volatility of HZN.  Maintaining a C-Ratio higher than the target will reduce your risk from volatility.",
    };
  }, [liquidationDeadline, targetRatio]);

  // const [loading, setLoading] = useState<boolean>(false);
  const clearLiquidationFlag = useCallback(async () => {
    try {
      const {
        contracts: { Liquidations },
      } = horizon.js!;

      const tx = await Liquidations.checkAndRemoveAccountInLiquidation(account);
      const res = await tx.wait(1);
      console.log("res", res);
      refresh();
    } catch (e) {
      console.log(e);
      console.log(e.error);
      const detail = `${e.error?.code}: ${e.error?.reason}`;
      enqueueSnackbar(e.error ? detail : "Failed to clear liquidation flag", {
        variant: "error",
      });
    }
  }, [account, enqueueSnackbar, refresh]);

  return (
    <BaseAlert title='Tip' content={content}>
      <ActionLink onClick={clearLiquidationFlag}>
        Clear Liquidation Flag
      </ActionLink>
    </BaseAlert>
  );
}
