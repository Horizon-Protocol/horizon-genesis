import { useEffect, useMemo } from "react";
import { useTimer } from "react-compound-timer";
import { differenceInMilliseconds, isDate } from "date-fns";

const DAY_MILLI_SECONDS = 1000 * 3600 * 24;
const MINUTE_MILLI_SECONDS = 1000 * 60;

export default function useDateCountDown(targetDate?: Date) {
  const milliSeconds = useMemo(() => {
    if (!targetDate) {
      return 0;
    }
    const diff = differenceInMilliseconds(targetDate, new Date());
    if (diff < 0) {
      return 0;
    }
    return diff;
  }, [targetDate]);

  const {
    controls: { setTime, start },
    value: { d, h, m, s, state },
  } = useTimer({
    initialTime: milliSeconds,
    direction: "backward",
    timeToUpdate:
      milliSeconds > DAY_MILLI_SECONDS ? MINUTE_MILLI_SECONDS : 1000,
  });

  const stopped = useMemo(() => state === "STOPPED", [state]);

  useEffect(() => {
    setTime(milliSeconds);
    start();
  }, [milliSeconds, setTime, start]);

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

  const dateCountDownDuration = useMemo(() => {
    if (!isDate(targetDate)) {
      return 0;
    }
    return s + m * 60 + h * 60 * 60 + d * 60 * 60 * 24
  }, [targetDate, d, h, m, s]);

  return {
    dateCountDownDuration,
    state,
    formatted,
    stopped,
  };
}
