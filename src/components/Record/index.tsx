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

const Img = styled("img")``;

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

  interface RecordButtonProps {
    img: string;
    selectedImg: string;
    selected: boolean;
    title: string | JSX.Element;
    to: string;
  }

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
        ({ to, img, selectedImg, selected, title }: RecordButtonProps) => (
          <Box
            key={to}
            onClick={() => {
              history.push(to);
            }}
            sx={{
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              mt: downLG ? "10px" : "0px",
              mb: downLG ? "0px" : "20px",
            }}
          >
            <Img
              src={selected ? selectedImg : img}
              sx={{
                width: "40px",
                height: "40px",
              }}
            />
            <Typography
              sx={{
                color: selected ? COLOR.safe : alpha(COLOR.text, 0.75),
                fontWeight: selected ? "bold" : "normal",
                lineHeight: "16px",
                fontSize: "14px",
                mt: "5px",
                textAlign: "center",
              }}
            >
              {title}
            </Typography>
          </Box>
        )
      )}
    </Box>
  );
}
