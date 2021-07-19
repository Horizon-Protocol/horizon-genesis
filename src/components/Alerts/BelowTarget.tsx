import { useMemo } from "react";
import fromUnixTime from "date-fns/fromUnixTime";
import { HZNBuyLink } from "@utils/constants";
import { COLOR } from "@utils/theme/constants";
import ActionLink from "./ActionLink";
import BaseAlert from "./Base";
import useDateCountDown from "@hooks/useDateCountDown";
import { formatCRatioToPercent } from "@utils/number";

interface Props {
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
}: Props) {
  const deadlineDate = useMemo(
    () => fromUnixTime(liquidationDeadline),
    [liquidationDeadline]
  );
  const { formatted } = useDateCountDown(deadlineDate);

  const { color, content } = useMemo(() => {
    if (liquidationDeadline > 0) {
      return {
        color: COLOR.danger,
        content: `Your account has flagged for liquidation. You have ${formatted} left to restore your c-ratio to ${formatCRatioToPercent(
          targetRatio
        )}% or you may be liquidated.`,
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
    targetRatio,
  ]);

  return (
    <BaseAlert title='Attention Required' content={content} color={color}>
      <ActionLink href={HZNBuyLink} target='_blank'>
        Buy HZN
      </ActionLink>
      <ActionLink to='/burn'>Burn zUSD</ActionLink>
    </BaseAlert>
  );
}
