import { useMemo } from "react";
import fromUnixTime from "date-fns/fromUnixTime";
import { BoxProps, Box } from "@mui/material";
import { HZNBuyLink } from "@utils/constants";
import { COLOR } from "@utils/theme/constants";
import { formatCRatioToPercent, formatNumber } from "@utils/number";
import useDateCountDown from "@hooks/useDateCountDown";
import ActionLink from "./ActionLink";
import BaseAlert from "./Base";
import {
  burnAmountToFixCRatioAtom,
} from "@atoms/debt";
import { useAtomValue } from "jotai/utils";
import { hznRateAtom } from "@atoms/exchangeRates";
import { targetRatioAtom } from "@atoms/app";
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

  const burnAmountToFixCRatio = useAtomValue(burnAmountToFixCRatioAtom)
  const hznRate = useAtomValue(hznRateAtom);

  const { addHZN, burnZUSD } = useMemo(()=>{
      return {
        addHZN: <Box component='span' sx={{ color: COLOR.safe }}>{formatNumber(burnAmountToFixCRatio.toNumber() / hznRate.toNumber() / targetRatio.toNumber())} HZN</Box>,
        burnZUSD: <Box component='span' sx={{ color: COLOR.warning }}>{formatNumber(burnAmountToFixCRatio.toNumber())} zUSD</Box>
      }
  },[burnAmountToFixCRatio])

  const { formatted, stopped } = useDateCountDown(deadlineDate);

  const { color, content } = useMemo(() => {
    if (liquidationDeadline > 0) {
      if (stopped) {
        return {
          color: COLOR.danger,
          content:
          <>Your account will be liquidated imminently.  You will need to add {addHZN} to wallet or burn {burnZUSD} to restore your c-ratio ASAP to avoid liquidation.</>,
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
      content:<>Your C-Ratio is below the target ratio. You will need to add {addHZN} to wallet or burn {burnZUSD} to raise your C-ratio and be able to claim rewards.</>,
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
        BUY HZN
      </ActionLink>
      <ActionLink ml='20px' color={COLOR.warning} to='/burn'>BURN zUSD</ActionLink>
    </BaseAlert>
  );
}
