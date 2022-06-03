import { useMemo } from "react";
import { useLocation, useHistory } from "react-router-dom";
import * as ReactGA from "react-ga";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { Badge, Tabs, Tab, TabProps, Box } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { PriorityHigh } from "@mui/icons-material";
import { COLOR_BG_40, COLOR_BG, PAGE_COLOR } from "@utils/theme/constants";
import { hasRewardsAtom } from "@atoms/feePool";
import path from "path/posix";
import { openLinkDropDownAtom } from "@atoms/wallet";

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
    to: "/home",
    label: "Home",
    color: PAGE_COLOR.earn,
  },
  {
    to: "/mint",
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
    padding: "4px 12px",
    borderRadius: 1,
    ...typography.subtitle1,
    textTransform: "none",
    letterSpacing: "1px",
    fontWeight: 400,
    overflow: "visible",
    ":hover": {
      color: color + "!important",
      backgroundColor: COLOR_BG,
      height: "36px",
    },
    ":focus": {
      // color,
    },
    "&.MuiTab-root": {
      color: "rgb(193, 211, 224,0.5)",
      background: COLOR_BG_40,
    },
    "&.Mui-selected": {
      color,
      backgroundColor: COLOR_BG,
      height: "36px",
    },
  }));

export default function NavTabs() {
  const history = useHistory();
  const { pathname } = useLocation();
  const setOpenLinkDropDown = useUpdateAtom(openLinkDropDownAtom);

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
        height: 38,
        p: "1px",
        borderRadius: 1,
        overflow: "visible",
        ".MuiTabs-scroller": {
          overflow: "visible !important",
        },
        ".MuiTabs-indicator": {
          top: 0,
          bottom: 0,
          height: "100%",
          borderRadius: 1,
          backgroundColor: COLOR_BG,
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
                badgeContent={<Box />}
                sx={{
                  ".MuiBadge-badge": {
                    display: "flex",
                    minWidth: 12,
                    width: 12,
                    height: 12,
                    p: 0,
                    top: -6,
                    right: -0,
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
