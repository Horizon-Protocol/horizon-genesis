import { useMemo } from "react";
import { useTimer } from "react-compound-timer";
import differenceInMilliseconds from "date-fns/differenceInMilliseconds";
import { useAtomValue } from "jotai/utils";
import { nextFeePeriodStartAtom } from "@atoms/feePool";

const mockClaimDate = new Date("2021-06-18T21:22:19Z");

export default function useClaimCountDown() {
  const nextStart = useAtomValue(nextFeePeriodStartAtom);
  // console.log("nextStart", nextStart);

  const milliSeconds = useMemo(
    () =>
      mockClaimDate ? differenceInMilliseconds(mockClaimDate, new Date()) : 0,
    []
  );

  const {
    value: { d, h, m, s },
  } = useTimer({
    initialTime: milliSeconds,
    direction: "backward",
  });

  const formatted = useMemo(() => {
    let res = ``;
    if (d > 0) {
      res += `${d}d `;
    }
    if (h > 0) {
      res += `${h}h `;
    }
    if (m > 0) {
      res += `${m}m `;
    }
    if (!d) {
      res += `${s}s `;
    }

    return res.trim();
  }, [d, h, m, s]);

  return {
    formatted,
  };
}
