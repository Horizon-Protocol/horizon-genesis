import { useMemo } from "react";
import { Box, Backdrop, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { useTimer } from "react-compound-timer";
import differenceInMilliseconds from "date-fns/differenceInMilliseconds";
import format from "date-fns/format";
import { Token } from "@/utils/constants";

const StyledBackdrop = withStyles({
  root: {
    position: "absolute",
    zIndex: 1,
    fontSize: 22,
    textAlign: "center",
  },
})(Backdrop);

interface Props {
  token: TokenEnum;
}

const Times: {
  [token in TokenEnum]: {
    start?: Date;
    end?: Date;
  };
} = {
  [Token.PHB]: {
    // start: new Date("2021-03-22T21:22:19Z"),
    // end: new Date("2021-03-29T21:22:19Z"),
  },
  [Token.HZN]: {},
  [Token.HZN_BNB_LP]: {},
  [Token.HZN_BNB_LP_DEPRECATED]: {},
  [Token.HZN_BNB_LP_LEGACY]: {},
};

const padZero = (num: number) => num.toString().padStart(2, "0");

export default function RoundStart({ token }: Props) {
  const { start, milliSeconds } = useMemo(() => {
    const start = Times[token].start;
    return {
      start,
      milliSeconds: start ? differenceInMilliseconds(start, new Date()) : 0,
    };
  }, [token]);

  const {
    value: { d, h, m, s },
  } = useTimer({
    initialTime: milliSeconds,
    direction: "backward",
  });

  if (!start || milliSeconds <= 0) {
    return null;
  }

  return (
    <StyledBackdrop open>
      <Box>
        <Typography variant='h5' display='block'>
          {d ? `${d} Day${d > 1 ? "s" : ""} ` : ""}
          {padZero(h)} : {padZero(m)} : {padZero(s)}
        </Typography>
        <Typography variant='caption' display='block'>
          {format(start, "yyyy-MM-dd HH:mm:ss OOOO")}
        </Typography>
      </Box>
    </StyledBackdrop>
  );
}
