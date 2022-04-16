import { useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Box, Typography, BoxProps, useMediaQuery } from "@mui/material";
import { alpha, useTheme, styled } from "@mui/material/styles";
import { COLOR } from "@utils/theme/constants";
import debtTracker from "@assets/images/debtTracker.png";
import debtTrackerSelected from "@assets/images/debtTracker-selected.png";
import escrow from "@assets/images/escrow.png";
import escrowSelected from "@assets/images/escrow-selected.png";
import historyU from "@assets/images/history.png";
import historySelected from "@assets/images/history-selected.png";
import RecordButton from "./Debt/RecordButton";

const Img = styled("img")``;

export interface RecordButtonProps {
  img: string;
  selectedImg: string;
  selected: boolean;
  title: string | JSX.Element;
  to: string;
}

export default function Record(props: BoxProps) {
  // const styledTabs = useMemo<StyledTabProps[]>(
  //     () =>
  //       tabs.map(({ color, ...item }) => ({
  //         ...item,
  //         color,
  //         StyledTab: getStyledTab(color) as StyledTabType,
  //         hasAlert: item.label === "Claim" && hasRewards,
  //       })),
  //     [hasRewards]
  //   );

  const { pathname } = useLocation();
  const history = useHistory();

  const { breakpoints } = useTheme();
  const downLG = useMediaQuery(breakpoints.down("lg"));

  const recordButtons = useMemo<RecordButtonProps[]>(
    () => [
      {
        img: debtTracker,
        selectedImg: debtTrackerSelected,
        selected: "/debtTracker" === pathname,
        title: (
          <>
            Debt
            <br />
            Tracker
          </>
        ),
        to: "debtTracker",
      },
      {
        img: escrow,
        selectedImg: escrowSelected,
        selected: "/escrow" === pathname,
        title: "Escrow",
        to: "escrow",
      },
      {
        img: historyU,
        selectedImg: historySelected,
        selected: "/history" === pathname,
        title: "History",
        to: "history",
      },
    ],
    [pathname]
  );

  return (
    <Box {...props}>
      {recordButtons.map(
        (data: RecordButtonProps, index: number) => (
          <RecordButton key={index} {...data}></RecordButton>
        )
      )}
    </Box>
  );
}
