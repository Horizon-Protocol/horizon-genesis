import { useMemo } from "react";
import { useTimer } from "react-compound-timer";
import differenceInMilliseconds from "date-fns/differenceInMilliseconds";
import isDate from "date-fns/isDate";

const HOUR_MILLI_SECONDS = 1000 * 3600;
const MINUTE_MILLI_SECONDS = 1000 * 60;

export default function useDateCountDown(targetDate?: Date) {
  const milliSeconds = useMemo(
    () => (targetDate ? differenceInMilliseconds(targetDate, new Date()) : 0),
    [targetDate]
  );

  const {
    value: { d, h, m, s, state },
  } = useTimer({
    initialTime: milliSeconds,
    direction: "backward",
    timeToUpdate:
      milliSeconds > HOUR_MILLI_SECONDS ? MINUTE_MILLI_SECONDS : 1000,
  });

  const formatted = useMemo(() => {
    if (!isDate(targetDate)) {
      return "n/a";
    }

    let res = ``;
    if (d > 0) {
      res += `${d}d `;
    }

    res += `${h}h `;

    res += `${m}m `;

    if (!d) {
      res += `${s}s `;
    }

    return res.trim();
  }, [targetDate, d, h, m, s]);

  return {
    state,
    formatted,
  };
}
