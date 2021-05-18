import { Tabs, Tab, withStyles } from "@material-ui/core";
import { useLocation, useHistory } from "react-router-dom";

interface LinkTabProps {
  label: string;
  to: string;
}

const tabs: LinkTabProps[] = [
  {
    to: "/",
    label: "Mint",
  },
  {
    to: "/burn",
    label: "Burn",
  },
  {
    to: "/claim",
    label: "Claim",
  },
  {
    to: "/earn",
    label: "Earn",
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

const StyledTab = withStyles(({ typography }) => ({
  root: {
    zIndex: 1,
    minHeight: 36,
    minWidth: 72,
    borderRadius: 4,
    backgroundColor: "transparent",
    ...typography.subtitle1,
    textTransform: "none",
    "&:hover": {
      color: "#92B2FF",
    },
    "&$selected": {
      color: "#92B2FF",
    },
    "&:focus": {
      color: "#92B2FF",
    },
  },
  selected: {},
}))(Tab);

export default function NavTabs() {
  const history = useHistory();
  const { pathname } = useLocation();

  return (
    <StyledTabs
      variant='fullWidth'
      value={pathname}
      textColor='primary'
      onChange={(_, value) => {
        history.push(value);
      }}
    >
      {tabs.map(({ to, label }) => (
        <StyledTab key={to} value={to} label={label} disableRipple />
      ))}
    </StyledTabs>
  );
}
