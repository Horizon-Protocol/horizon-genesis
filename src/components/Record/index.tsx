import { useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Box, Typography, BoxProps, useMediaQuery } from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";
import RecordButton from "./Debt/RecordButton";
import { ReactComponent as IconDebtTracker } from "@assets/images/debtTracker.svg";
import { ReactComponent as IconDebtTrackerSelected } from "@assets/images/debtTracker-selected.svg";
import { ReactComponent as IconEscrow } from "@assets/images/escrow.svg";
import { ReactComponent as IconEscrowSelected } from "@assets/images/escrow-selected.svg";
import { ReactComponent as IconHistory } from "@assets/images/history.svg";
import { ReactComponent as IconHistorySelected } from "@assets/images/history-selected.svg";
import { ReactComponent as IconAuthorize } from "@assets/images/authorize.svg";
import { ReactComponent as IconAuthorizeSelected } from "@assets/images/authorize-selected.svg";

const Img = styled("img")``;

export interface RecordButtonProps {
  img: JSX.Element;
  selectedImg: JSX.Element;
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
        img: <IconDebtTracker />,
        selectedImg: <IconDebtTrackerSelected />,
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
        img: <IconEscrow />,
        selectedImg: <IconEscrowSelected />,
        selected: "/escrow" === pathname,
        title: "Escrow",
        to: "escrow",
      },
      {
        img: <IconAuthorize />,
        selectedImg: <IconAuthorizeSelected />,
        selected: "/authorize" === pathname,
        title: "Authorize",
        to: "authorize",
      },
      {
        img: <IconHistory />,
        selectedImg: <IconHistorySelected />,
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
