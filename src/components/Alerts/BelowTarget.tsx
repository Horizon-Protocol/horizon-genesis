import { useMemo } from "react";
import fromUnixTime from "date-fns/fromUnixTime";
import { BoxProps } from "@mui/material";
import { HZNBuyLink } from "@utils/constants";
import { COLOR } from "@utils/theme/constants";
import { formatCRatioToPercent } from "@utils/number";
import useDateCountDown from "@hooks/useDateCountDown";
import ActionLink from "./ActionLink";
import BaseAlert from "./Base";

interface Props extends BoxProps {
  currentCRatio: BN;
  targetRatio: BN;
  liquidationRatio: BN;
  liquidationDeadline: number;
}

export default function BelowTarget({
  currentCRatio,
  targetRatio,
  liquidationRatio,
  liquidationDeadline,
  ...props
}: Props) {
  const deadlineDate = useMemo(
    () => fromUnixTime(liquidationDeadline),
    [liquidationDeadline]
  );
  const { formatted, stopped } = useDateCountDown(deadlineDate);

  const { color, content } = useMemo(() => {
    if (liquidationDeadline > 0) {
      if (stopped) {
        return {
          color: COLOR.danger,
          content:
            "Your account will be liquidated imminently.  Restore your c-ratio ASAP to avoid liquidation.",
        };
      }
      return {
        color: COLOR.danger,
        content: `Your account is flagged for liquidation. You have ${formatted} to restore your c-ratio to ${formatCRatioToPercent(
          targetRatio
        )}% and clear your liquidation flag or you may be liquidated.`,
      };
    }

    if (currentCRatio.gte(liquidationRatio)) {
      return {
        color: COLOR.danger,
        content:
          "You are at risk of being liquidated. Please immediately add HZN to your wallet or burn zUSD to restore your c-ratio.",
      };
    }

    return {
      color: COLOR.warning,
      content:
        "Your C-Ratio is below the target ratio. You will need to add HZN to wallet or burn zUSD to raise your C-ratio and be able to claim rewards.",
    };
  }, [
    currentCRatio,
    formatted,
    liquidationDeadline,
    liquidationRatio,
    stopped,
    targetRatio,
  ]);

  return (
    <BaseAlert
      baseColor={color}
      title='Attention Required'
      content={content}
      {...props}
    >
      <ActionLink href={HZNBuyLink} target='_blank'>
        Buy HZN
      </ActionLink>
      <ActionLink ml='20px' color={COLOR.warning} to='/burn'>Burn zUSD</ActionLink>
    </BaseAlert>
  );
}
