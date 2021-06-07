import { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useAtomValue } from "jotai/utils";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { readyAtom } from "@atoms/app";
import useSetupHorizonLib from "@hooks/useSetupHorizonLib";
import useFetchAppData from "@hooks/useFetchAppData";
import useFetchDebtData from "@hooks/useFetchDebtData";
import useFetchZAssets from "@hooks/useFetchZAssets";
import useFetchFeePool from "@hooks/useFetchFeePool";
import useRefresh from "@hooks/useRefresh";
import Mint from "@pages/mint";
import Burn from "@pages/burn";
import Claim from "@pages/claim";
// import Earn from "@pages/earn";
import Header from "@components/Header";
import Dashboard from "@components/Dashboard";

const useStyles = makeStyles(() => ({
  dashboard: {
    width: "100%",
    maxWidth: 320,
    position: "fixed",
    top: 100,
    right: 24,
  },
}));

function App() {
  const classes = useStyles();

  const dashboardVisible = true;

  const appReady = useAtomValue(readyAtom);

  useSetupHorizonLib();
  useFetchAppData();
  useFetchDebtData();
  useFetchZAssets();
  useFetchFeePool();

  const refresh = useRefresh();

  useEffect(() => {
    if (appReady) {
      refresh();
    }
  }, [appReady, refresh]);

  return (
    <Router>
      <Header />
      {/* TODO: use floating button to expand and collapse for mobile */}
      <Box hidden={!dashboardVisible} className={classes.dashboard} zIndex={1}>
        <Dashboard />
      </Box>

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
