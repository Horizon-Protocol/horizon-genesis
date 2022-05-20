import { BoxProps } from "@mui/material";
import ActionLink from "./ActionLink";
import BaseAlert from "./Base";
import useDateCountDown from "@hooks/useDateCountDown";
import { useAtomValue } from "jotai/utils";
import { rewardsAtom, feePeriodDatesAtom, currentFeePeriodAtom,nextClaimCountDownAtom } from "@atoms/feePool";
import { getTodayTimestampSeconds, secondsOfDays } from "@utils/date";
import { COLOR } from "@utils/theme/constants";

interface Props extends BoxProps {

}

export default function Claimable({...props }: Props) {
  const { nextFeePeriodStarts } = useAtomValue(feePeriodDatesAtom);
  const { formatted } = useDateCountDown(nextFeePeriodStarts);
  const { startTime, feePeriodDuration } = useAtomValue(currentFeePeriodAtom);
  const nextClaimCountDown = useAtomValue(nextClaimCountDownAtom);

  const leftTimeSecondToClaim = (startTime + feePeriodDuration) - getTodayTimestampSeconds()
  // console.log('========leftTimeSecondToClaim=========',{leftTimeSecondToClaim:leftTimeSecondToClaim})

  let title, content, baseColor = ""

  if (leftTimeSecondToClaim < secondsOfDays(3) && leftTimeSecondToClaim > secondsOfDays(1)){
    title = "ATTENTION REQUIRED"
    content = `You have unclaimed rewards. If you do not claim your rewards within ${nextClaimCountDown}, your rewards will be forfeited.`
    baseColor = COLOR.warning;
  }

  if (leftTimeSecondToClaim < secondsOfDays(1) || leftTimeSecondToClaim > secondsOfDays(3)){
    title = "URGENT ACTION REQUIRED"
    content = `You have unclaimed rewards. If you do not claim your rewards within ${nextClaimCountDown}, your rewards will be forfeited.`
    baseColor = "#FA2256";
  }

  // if (claimable && (nextFeePeriodStarts - getCurrentTimestampSeconds) < feePeriodDatesAtom)

  // alert(periodEnds)
  return (
    <BaseAlert
      title={title}
      content={content}
      baseColor={baseColor}
      {...props}
    >
      <ActionLink to='claim'>
        CLAIM NOW
      </ActionLink>
    </BaseAlert>
  );
}
