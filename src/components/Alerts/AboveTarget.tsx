import { useCallback, useMemo } from "react";
import { useSnackbar } from "notistack";
import fromUnixTime from "date-fns/fromUnixTime";
import { BoxProps } from "@mui/material";
import horizon from "@lib/horizon";
import useWallet from "@hooks/useWallet";
import useRefresh from "@hooks/useRefresh";
import useDateCountDown from "@hooks/useDateCountDown";
import { formatCRatioToPercent } from "@utils/number";
import { getWalletErrorMsg } from "@utils/helper";
import { COLOR } from "@utils/theme/constants";
import ActionLink from "./ActionLink";
import BaseAlert from "./Base";

interface Props extends BoxProps {
  targetRatio: BN;
  liquidationDeadline: number;
}

export default function AboveTarget({
  targetRatio,
  liquidationDeadline,
  ...props
}: Props) {
  const { account } = useWallet();
  const { enqueueSnackbar } = useSnackbar();
  const refresh = useRefresh();

  const deadlineDate = useMemo(
    () => fromUnixTime(liquidationDeadline),
    [liquidationDeadline]
  );
  const { formatted, stopped } = useDateCountDown(deadlineDate);

  const {
    color,
    title = "Tip",
    content,
    actionLink,
  } = useMemo(() => {
    if (liquidationDeadline > 0) {
      if (stopped) {
        return {
          color: COLOR.danger,
          title: "Attention Required",
          content: `Your account will be liquidated immediately if you drop below ${formatCRatioToPercent(
            targetRatio
          )}% c-ratio. Clear your liquidation flag ASAP to avoid liquidation.`,
          actionLink: <ActionLink onClick={clearLiquidationFlag}>
          Clear Liquidation Flag
        </ActionLink>
        };
      }
      return {
        color: COLOR.danger,
        title: "Attention Required",
        content: `Your account is still flagged for liquidation. You have ${formatted} to clear this flag or you may be at risk of liquidation if your c-ratio drops below ${formatCRatioToPercent(
          targetRatio
        )}%.`,
        actionLink: <ActionLink onClick={clearLiquidationFlag}>
          Clear Liquidation Flag
        </ActionLink>
      };
    }
    return {
      content:
        "Your C-Ratio is above the target. You may mint additional zUSD to earn more rewards, or keep your C-Ratio higher to reduce risk from volatility.",
        actionLink: <ActionLink to="mint">
          MINT NOW
        </ActionLink>
    };
  }, [formatted, liquidationDeadline, stopped, targetRatio]);

  // const [loading, setLoading] = useState<boolean>(false);
  const clearLiquidationFlag = useCallback(async () => {
    try {
      const {
        contracts: { Liquidations },
      } = horizon.js!;

      const tx = await Liquidations.checkAndRemoveAccountInLiquidation(account);
      const res = await tx.wait(1);
      // console.log("res", res);
      refresh();
    } catch (e: any) {
      enqueueSnackbar(
        getWalletErrorMsg(e, "Failed to clear liquidation flag"),
        {
          variant: "error",
        }
      );
    }
  }, [account, enqueueSnackbar, refresh]);

  return (
    <BaseAlert baseColor={color} title={title} content={content} {...props}>
      {actionLink}
      {/* {liquidationDeadline > 0 && (
        <ActionLink onClick={clearLiquidationFlag}>
          Clear Liquidation Flag
        </ActionLink>
      )} */}
    </BaseAlert>
  );
}
