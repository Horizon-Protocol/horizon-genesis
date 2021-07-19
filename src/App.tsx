import { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import ReactGA from "react-ga";
import { useAtomValue } from "jotai/utils";
import {
  Box,
  Hidden,
  useMediaQuery,
  Button,
  Typography,
} from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import { readyAtom } from "@atoms/app";
import useSetupHorizonLib from "@hooks/useSetupHorizonLib";
import useFetchAppData from "@hooks/useFetchAppData";
import useFetchDebtData from "@hooks/useFetchDebtData";
import useFetchZAssets from "@hooks/useFetchZAssets";
import useFetchFeePool from "@hooks/useFetchFeePool";
import useRefresh from "@hooks/useRefresh";
import useIsEarnPage from "@hooks/useIsEarnPage";
import Mint from "@pages/mint";
import Burn from "@pages/burn";
import Claim from "@pages/claim";
import Earn from "@pages/earn";
import Header from "@components/Header";
import Dashboard from "@components/Dashboard";
import Alerts from "@components/Alerts";

const AppDisabled = !!import.meta.env.VITE_APP_DISABLED;

ReactGA.initialize("UA-199967475-1", {
  // debug: true,
});
ReactGA.pageview(window.location.pathname + window.location.search);

const useStyles = makeStyles(({ breakpoints, palette }) => ({
  container: {
    filter: AppDisabled ? "blur(2px)" : undefined,
  },
  body: {
    margin: "24px 0",
    display: "flex",
    justifyContent: "center",
    [breakpoints.down("md")]: {
      margin: "24px 0",
    },
    [breakpoints.down("sm")]: {
      flexWrap: "wrap",
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
    [breakpoints.down("sm")]: {
      flex: "1 1 480px",
      margin: "0 8px 150px",
    },
  },
  pageEarn: {
    margin: "0 24px",
    [breakpoints.down("sm")]: {
      margin: "0 8px 150px",
    },
  },
  alerts: {
    [breakpoints.down("sm")]: {
      margin: "16px 20px 0",
      // position: "fixed",
      // right: 0,
      // zIndex: 3,
    },
  },
  dashboard: {
    width: "100%",
    maxWidth: 320,
    [breakpoints.down("sm")]: {
      zIndex: 3,
      maxWidth: "100%",
      position: "fixed",
      left: 0,
      right: 0,
      bottom: 0,
      maxHeight: 170,
      background: "black",
      overflow: "hidden",
      borderTop: `2px solid ${palette.divider}`,
      backgroundColor: "#102637",
      transition: "max-height 0.25s ease-in",
      "&.expanded": {
        maxHeight: "100%",
      },
    },
  },
  showMore: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  mask: {
    zIndex: 99,
    content: '""',
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
}));

function App() {
  const { breakpoints } = useTheme();
  const downSM = useMediaQuery(breakpoints.down("sm"));
  const classes = useStyles();

  const isEarnPage = useIsEarnPage();

  const appReady = useAtomValue(readyAtom);

  const [expanded, setExpanded] = useState(false);

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
    <>
      {AppDisabled && (
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          className={classes.mask}
        >
          <Typography
            variant='h3'
            color='textPrimary'
            gutterBottom
            style={{
              fontWeight: 700,
            }}
          >
            Available Soon
          </Typography>
        </Box>
      )}
      <Box className={classes.container}>
        <Header />

        {!isEarnPage && downSM && (
          <Alerts px={2} py={1} mb={2} className={classes.alerts} />
        )}
        <Box className={classes.body}>
          {!isEarnPage && (
            <Hidden mdDown>
              <Box className={classes.placeholder}></Box>
            </Hidden>
          )}
          <Box className={isEarnPage ? classes.pageEarn : classes.page}>
            <Switch>
              <Route path='/burn'>
                <Burn />
              </Route>
              <Route path='/claim'>
                <Claim />
              </Route>
              <Route path='/earn'>
                <Earn />
              </Route>
              <Route path='/'>
                <Mint />
              </Route>
            </Switch>
          </Box>
          {!isEarnPage && (
            <Box
              className={clsx(classes.dashboard, expanded ? "expanded" : "")}
            >
              {!downSM && (
                <Alerts px={2} py={1} mb={2} className={classes.alerts} />
              )}
              <Dashboard />
              {downSM && (
                <Button
                  startIcon={expanded ? <ExpandMore /> : <ExpandLess />}
                  className={classes.showMore}
                  onClick={() => setExpanded((v) => !v)}
                >
                  Show {expanded ? "Less" : "More"}
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}

export default App;
