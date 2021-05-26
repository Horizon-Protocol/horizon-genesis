import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Mint from "@pages/mint";
import Burn from "@pages/burn";
import Claim from "@pages/claim";
// import Earn from "@pages/earn";
import Header from "@components/Header";
import Dashboard from "@components/Dashboard";
import useFetchAppData from "@hooks/useFetchAppData";
import useFetchDebtData from "@hooks/useFetchDebtData";
import useFetchZAssets from "@hooks/useFetchZAssets";
import useFetchFeePool from "@hooks/useFetchFeePool";

const useStyles = makeStyles(() => ({
  dashboard: {
    position: "fixed",
    top: 100,
    right: 24,
  },
}));

function App() {
  const classes = useStyles();

  const dashboardVisible = true;

  useFetchAppData();
  useFetchDebtData();
  useFetchZAssets();
  useFetchFeePool("0");

  return (
    <Router>
      <Header />
      {/* TODO: use floating button to expand and collapse for mobile */}
      <Dashboard
        hidden={!dashboardVisible}
        className={classes.dashboard}
        zIndex={1}
      />

      <Box my={3}>
        <Switch>
          <Route path='/burn'>
            <Burn />
          </Route>
          <Route path='/claim'>
            <Claim />
          </Route>
          {/* <Route path='/earn'>
            <Earn />
          </Route> */}
          <Route path='/'>
            <Mint />
          </Route>
        </Switch>
      </Box>
    </Router>
  );
}

export default App;
