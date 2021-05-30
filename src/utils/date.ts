import format from "date-fns/format";
import padStart from "lodash/padStart";
import getISOWeeksInYear from "date-fns/getISOWeeksInYear";

export const WEEKS_IN_YEAR = getISOWeeksInYear(new Date());

export const DURATION_SEPARATOR = " ";

export const formatTxTimestamp = (timestamp: number | Date) =>
  format(timestamp, "MMM d, yy | HH:mm");

export const toJSTimestamp = (timestamp: number) => timestamp * 1000;

export const formatShortDate = (date: Date | number) =>
  format(date, "MMM d, yyyy");

export const formatShortDateWithTime = (date: Date | number) =>
  format(date, "MMM d, yyyy H:mma");

export const secondsToTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = seconds - minutes * 60;

  return `${padStart(minutes.toString(), 2, "0")}:${padStart(
    secondsLeft.toString(),
    2,
    "0"
  )}`;
};

export const toFutureDate = (seconds: number) => {
  return formatShortDateWithTime(
    new Date(new Date().getTime() + seconds * 1000)
  );
};
export const getCurrentTimestampSeconds = () => Date.now() / 1000;
