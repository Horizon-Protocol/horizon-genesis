import { useMemo } from "react";
import { useLocation, useHistory } from "react-router-dom";
import * as ReactGA from "react-ga";
import { useAtomValue } from "jotai/utils";
import { Badge, Tabs, Tab, TabProps } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { PriorityHigh } from "@mui/icons-material";
import { PAGE_COLOR } from "@utils/theme/constants";
import { hasRewardsAtom } from "@atoms/feePool";

type StyledTabType = (props: TabProps) => JSX.Element;

interface LinkTabProps {
  label: string;
  to: string;
  color: string;
}
interface StyledTabProps extends LinkTabProps {
  StyledTab: StyledTabType;
  hasAlert: boolean;
}

const tabs: LinkTabProps[] = [
  {
    to: "/",
    label: "Mint",
    color: PAGE_COLOR.mint,
  },
  {
    to: "/burn",
    label: "Burn",
    color: PAGE_COLOR.burn,
  },
  {
    to: "/claim",
    label: "Claim",
    color: PAGE_COLOR.claim,
  },
  {
    to: "/earn",
    label: "Earn",
    color: PAGE_COLOR.earn,
  },
];

const getStyledTab: (color: string) => unknown = (color) =>
  styled(Tab)(({ theme: { typography } }) => ({
    zIndex: 1,
    minHeight: 32,
    minWidth: 72,
    padding: "4px 10px",
    borderRadius: 1,
    bgcolor: "transparent",
    ...typography.subtitle1,
    textTransform: "none",
    letterSpacing: "0.57px",
    fontWeight: 500,
    overflow: "visible",
    ":hover": {
      color,
    },
    ":focus": {
      color,
    },
    "&.Mui-selected	": {
      color,
      textShadow: `0 0 4px ${alpha(color, 0.5)}`,
    },
  }));

export default function NavTabs() {
  const history = useHistory();
  const { pathname } = useLocation();

  const hasRewards = useAtomValue(hasRewardsAtom);

  const styledTabs = useMemo<StyledTabProps[]>(
    () =>
      tabs.map(({ color, ...item }) => ({
        ...item,
        color,
        StyledTab: getStyledTab(color) as StyledTabType,
        hasAlert: item.label === "Claim" && hasRewards,
      })),
    [hasRewards]
  );

  const currentTab = useMemo(
    () => tabs.find(({ to }) => to === pathname)?.to || false,
    [pathname]
  );

  return (
    <Tabs
      variant="fullWidth"
      value={currentTab}
      textColor="primary"
      onChange={(_, value) => {
        if (value !== pathname) {
          history.push(value);
          if (import.meta.env.PROD) {
            ReactGA.pageview(value);
          }
        }
      }}
      sx={{
        minHeight: 32,
        p: "1px",
        borderRadius: 1,
        border: `1px solid rgba(55,133,185,0.25)`,
        overflow: "visible",
        ".MuiTabs-scroller": {
          overflow: "visible !important",
        },
        ".MuiTabs-indicator": {
          top: 0,
          bottom: 0,
          height: "100%",
          borderRadius: 1,
          backgroundColor: "#1A2E47",
        },
      }}
    >
      {styledTabs.map(({ to, label, StyledTab, hasAlert }) => (
        <StyledTab
          key={to}
          value={to}
          label={
            hasAlert ? (
              <Badge
                overlap="circular"
                badgeContent={
                  <PriorityHigh
                    sx={{
                      fontSize: 10,
                    }}
                  />
                }
                sx={{
                  ".MuiBadge-badge": {
                    display: "flex",
                    minWidth: 16,
                    width: 16,
                    height: 16,
                    p: 0,
                    top: -6,
                    right: -8,
                    bgcolor: "#F5841F",
                    color: "white",
                  },
                }}
              >
                {label}
              </Badge>
            ) : (
              label
            )
          }
          disableRipple
        />
      ))}
    </Tabs>
  );
}
