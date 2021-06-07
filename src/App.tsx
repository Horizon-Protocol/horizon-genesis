import { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useAtomValue } from "jotai/utils";
import { Box, Hidden } from "@material-ui/core";
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

const useStyles = makeStyles(({ breakpoints }) => ({
  body: {
    display: "flex",
    justifyContent: "center",
    [breakpoints.down("md")]: {
      margin: "24px 0",
    },
  },
  placeholder: {
    flexShrink: 1,
    width: "100%",
    maxWidth: 320,
    [breakpoints.down("lg")]: {
      maxWidth: 280,
    },
  },
  page: {
    margin: "0 24px",
    flexBasis: 640,
    [breakpoints.down("lg")]: {
      flexBasis: "600px",
    },
  },
  dashboard: {
    width: "100%",
    maxWidth: 320,
    [breakpoints.down("sm")]: {
      position: "fixed",
      right: 0,
    },
  },
}));

function App() {
  const classes = useStyles();

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

      <Box className={classes.body}>
        <Hidden mdDown>
          <Box className={classes.placeholder}></Box>
        </Hidden>
        <Box className={classes.page}>
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
        <Box className={classes.dashboard}>
          <Dashboard />
        </Box>
      </Box>
    </Router>
  );
}

export default App;
