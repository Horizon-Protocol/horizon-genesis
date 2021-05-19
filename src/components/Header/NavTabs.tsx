import { Tabs, Tab, TabProps } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { useLocation, useHistory } from "react-router-dom";
import { PAGE_COLOR } from "@utils/theme/constants";
import { useMemo } from "react";

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

const StyledTabs = withStyles(({ palette }) => ({
  root: {
    minHeight: 36,
    borderRadius: 4,
    border: `1px solid ${palette.divider}`,
  },
  indicator: {
    backgroundColor: "rgb(26, 46, 71, 0.5)",
    top: 0,
    bottom: 0,
    height: "100%",
  },
}))(Tabs);

const getStyledTab: (color: string) => any = (color) =>
  withStyles(({ typography }) => ({
    root: {
      zIndex: 1,
      minHeight: 36,
      minWidth: 72,
      borderRadius: 4,
      backgroundColor: "transparent",
      ...typography.subtitle1,
      textTransform: "none",
      "&:hover": {
        color,
      },
      "&:focus": {
        color,
      },
      "&$selected": {
        color,
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

  return (
    <StyledTabs
      variant='fullWidth'
      value={pathname}
      textColor='primary'
      onChange={(_, value) => {
        history.push(value);
      }}
    >
      {styledTabs.map(({ to, label, StyledTab }) => (
        <StyledTab key={to} value={to} label={label} disableRipple />
      ))}
    </StyledTabs>
  );
}
