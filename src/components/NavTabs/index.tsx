import { Tabs, Tab } from "@material-ui/core";
import { Link, useLocation } from "react-router-dom";

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

export default function NavTabs() {
  const { pathname } = useLocation();

  return (
    <Tabs value={pathname} indicatorColor='primary' textColor='primary'>
      {tabs.map(({ to, label }) => (
        <Tab key={to} value={to} to={to} label={label} component={Link} />
      ))}
    </Tabs>
  );
}
