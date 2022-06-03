import { useEffect } from "react";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { feePeriodDatesAtom, nextClaimCountDownAtom, nextClaimCountDownDurationAtom } from "@atoms/feePool";
import useDateCountDown from "./useDateCountDown";

export default function useNextClaimCountDown() {
  const setNextClaimCountDown = useUpdateAtom(nextClaimCountDownAtom);
  const setNextClaimCountDownDuration = useUpdateAtom(nextClaimCountDownDurationAtom);

  const { nextFeePeriodStarts } = useAtomValue(feePeriodDatesAtom);

  const { formatted, dateCountDownDuration } = useDateCountDown(nextFeePeriodStarts);

  useEffect(() => {
    // console.log("=====dateCountDownDuration=====",dateCountDownDuration)
    setNextClaimCountDown(formatted);
    setNextClaimCountDownDuration(dateCountDownDuration)
  }, [formatted, setNextClaimCountDown]);
}
