import padStart from "lodash/padStart";
import { format, getISOWeeksInYear } from "date-fns";

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

export const TimeToSecond = (date: Date) => {
  // return Date.parse(date) / 1000;
};

export const toFutureDate = (seconds: number) => {
  return formatShortDateWithTime(
    new Date(new Date().getTime() + seconds * 1000)
  );
};

export const getTodayTimestampSeconds = () => Date.now() / 1000;

export const secondsOfDays = (days: number) => {
  return days * 24 * 60 * 60;
}