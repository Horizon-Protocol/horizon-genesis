import { useEffect } from "react";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { feePeriodDatesAtom, nextClaimCountDownAtom } from "@atoms/feePool";
import useDateCountDown from "./useDateCountDown";

export default function useNextClaimCountDown() {
  const setNextClaimCountDown = useUpdateAtom(nextClaimCountDownAtom);

  const { nextFeePeriodStarts } = useAtomValue(feePeriodDatesAtom);

  const { formatted } = useDateCountDown(nextFeePeriodStarts);

  useEffect(() => {
    console.log("=====formatted=====",formatted)
    setNextClaimCountDown(formatted);
  }, [formatted, setNextClaimCountDown]);
}
