import { useMemo } from "react";
import { useLocation, useHistory } from "react-router-dom";
import ReactGA from "react-ga";
import { Tabs, Tab, TabProps } from "@material-ui/core";
import { withStyles, fade } from "@material-ui/core/styles";
import { PAGE_COLOR } from "@utils/theme/constants";

type StyledTabType = (props: TabProps) => JSX.Element;

interface LinkTabProps {
  label: string;
  to: string;
  color: string;
}
interface StyledTabProps extends LinkTabProps {
  StyledTab: StyledTabType;
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

const StyledTabs = withStyles({
  root: {
    minHeight: 32,
    padding: 1,
    borderRadius: 4,
    border: `1px solid rgba(55,133,185,0.25)`,
  },
  indicator: {
    top: 0,
    bottom: 0,
    height: "100%",
    borderRadius: 4,
    backgroundColor: "#1A2E47",
  },
})(Tabs);

const getStyledTab: (color: string) => any = (color) =>
  withStyles(({ typography }) => ({
    root: {
      zIndex: 1,
      minHeight: 32,
      minWidth: 72,
      padding: "4px 10px",
      borderRadius: 4,
      backgroundColor: "transparent",
      ...typography.subtitle1,
      textTransform: "none",
      letterSpacing: "0.57px",
      fontWeight: 500,
      "&:hover": {
        color,
      },
      "&:focus": {
        color,
      },
      "&$selected": {
        color,
        textShadow: `0 0 4px ${fade(color, 0.5)}`,
      },
    },
    selected: {},
  }))(Tab);

export default function NavTabs() {
  const history = useHistory();
  const { pathname } = useLocation();

  const styledTabs = useMemo<StyledTabProps[]>(
    () =>
      tabs.map(({ color, ...item }) => ({
        ...item,
        color,
        StyledTab: getStyledTab(color) as StyledTabType,
      })),
    []
  );

  const currentTab = useMemo(
    () => tabs.find(({ to }) => to === pathname)?.to || false,
    [pathname]
  );

  return (
    <StyledTabs
      variant='fullWidth'
      value={currentTab}
      textColor='primary'
      onChange={(_, value) => {
        if (value !== pathname) {
          history.push(value);
          ReactGA.pageview(value);
        }
      }}
    >
      {styledTabs.map(({ to, label, StyledTab }) => (
        <StyledTab key={to} value={to} label={label} disableRipple />
      ))}
    </StyledTabs>
  );
}
