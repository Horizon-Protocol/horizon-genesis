import { useEffect, useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import ReactGA from "react-ga";
import { hotjar } from "react-hotjar";
import { useAtomValue } from "jotai/utils";
import {
  Box,
  Hidden,
  useMediaQuery,
  Button,
  Typography,
  BoxProps,
  Container,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { readyAtom } from "@atoms/app";
import useSetupHorizonLib from "@hooks/useSetupHorizonLib";
import useFetchAppData from "@hooks/useFetchAppData";
import useFetchDebtData from "@hooks/useFetchDebtData";
import useFetchZAssetsBalance from "@hooks/useFetchZAssetsBalance";
import useFetchFeePool from "@hooks/useFetchFeePool";
import useFetchRewards from "@hooks/useFetchRewards";
import useFetchHorizonData from "@hooks/useFetchHorizonData";
import useRefresh from "@hooks/useRefresh";
import useIsEarnPage from "@hooks/useIsEarnPage";
import Home from "@pages/Home";
import Mint from "@pages/mint";
import Burn from "@pages/burn";
import Claim from "@pages/claim";
import Earn from "@pages/earn";
import Header from "@components/Header";
import Dashboard from "@components/Dashboard";
import Alerts from "@components/Alerts";
import AlertDashboard from "@components/Alerts/Dashboard";
import Record from "@components/Record";
import DebtTracker from "@pages/DebtTracker";
import Escrow from "@pages/Escrow";
import History from "@pages/History";
import useQueryDebt from "@hooks/query/useQueryDebt";
import useQueryGlobalDebt from "@hooks/query/useQueryGlobalDebt";
import useEscrowDataQuery from "@hooks/Escrowed/useEscrowDataQuery";

const AppDisabled = !!import.meta.env.VITE_APP_DISABLED;

if (import.meta.env.PROD) {
  ReactGA.initialize("UA-199967475-1", {
    // debug: true,
  });
  ReactGA.pageview(window.location.pathname + window.location.search);
}

function App() {
  const { breakpoints } = useTheme();
  const downMD = useMediaQuery(breakpoints.down("md"));
  const downLG = useMediaQuery(breakpoints.down("lg"));

  const isEarnPage = useIsEarnPage();

  const appReady = useAtomValue(readyAtom);

  const [expanded, setExpanded] = useState(false);

  useSetupHorizonLib();
  useQueryDebt();
  useFetchAppData();
  useFetchDebtData();
  useFetchZAssetsBalance();
  useFetchFeePool();
  useFetchRewards();
  useFetchHorizonData();
  useEscrowDataQuery();
  useQueryGlobalDebt();

  const refresh = useRefresh();

  useEffect(() => {
    if (appReady) {
      refresh();
    }
  }, [appReady, refresh]);

  useEffect(() => {
    if (import.meta.env.PROD) {
      hotjar.initialize(2506984, 6);
    }
  }, []);

  const alertProps: BoxProps = {
    px: 2,
    py: 1,
    mt: {
      xs: 2,
      md: 0,
    },
    mb: {
      xs: 0,
      md: 2,
    },
    mx: {
      xs: 1,
      sm: 2,
      md: 0,
    },
  };

  const recordProps: BoxProps = {
    mb: 0,
    // bgcolor:'red',
    right: 0,
    top: 0,
    position: downLG ? "static" : "absolute",
    display: downLG ? "flex" : "block",
    justifyContent: "space-around",
  };

  return (
    <>
      {AppDisabled && (
        <Box
          position={"fixed"}
          zIndex={99}
          top={0}
          right={0}
          bottom={0}
          left={0}
          display='flex'
          justifyContent='center'
          alignItems='center'
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
      <Box
        sx={{
          filter: AppDisabled ? "blur(2px)" : undefined,
        }}
      >
        <Header />
        {!isEarnPage && downMD && (
          <>
            <Alerts {...alertProps} />
            <AlertDashboard {...alertProps} />
          </>
        )}
        {!isEarnPage && downLG && <Record {...recordProps} />}
        <Box
          my={3}
          display='flex'
          justifyContent='center'
          flexWrap={{
            xs: "wrap",
            md: "nowrap",
          }}
        >
          {!isEarnPage && (
            <Hidden lgDown>
              <Box
                position='relative'
                width='100%'
                maxWidth={{
                  xs: 0,
                  sm: 220,
                  lg: 320,
                }}
                flexShrink={1}
              >
                <Record {...recordProps} />
              </Box>
            </Hidden>
          )}
          <Box
            my={3}
            m={{
              xs: "0 8px 150px",
              md: "0 24px",
            }}
            flexGrow={
              isEarnPage
                ? undefined
                : {
                    xs: 1,
                    md: 0,
                  }
            }
            flexShrink={
              isEarnPage
                ? undefined
                : {
                    xs: 1,
                    md: 0,
                  }
            }
            flexBasis={
              isEarnPage
                ? undefined
                : {
                    xs: 480,
                    sm: 600,
                    lg: 640,
                    xl: 640,
                  }
            }
          >
            <Switch>
              <Route
                exact
                path='/'
                render={() => <Redirect to='/home' push />}
              />
              {/* <CacheRoute path="/home"><Home /></CacheRoute> */}
              <Route path='/home'>
                <Home />
              </Route>
              <Route path='/burn'>
                <Burn />
              </Route>
              <Route path='/claim'>
                <Claim />
              </Route>
              <Route path='/earn'>
                <Earn />
              </Route>
              <Route path='/mint'>
                <Mint />
              </Route>
              <Route path='/debtTracker'>
                <DebtTracker />
              </Route>
              <Route path='/escrow'>
                <Escrow />
              </Route>
              <Route path='/history'>
                <History />
              </Route>
            </Switch>
          </Box>
          {!isEarnPage && (
            <Box
              pr={{
                xs: 0,
                sm: 0,
                md: 1,
                lg: 2,
              }}
              position={{
                xs: "fixed",
                md: "static",
              }}
              left={0}
              right={0}
              bottom={0}
              zIndex={3}
              // width='100%'
              width={{
                xs: "100%",
                md: 300,
                lg: 300,
              }}
              // maxWidth={{
              //   xs: "100%",
              //   md: 320,
              //   lg: 320,
              // }}
              minWidth={{
                md: 300,
                lg: 300,
              }}
              maxHeight={{
                xs: expanded ? "100%" : 170,
                md: "100%",
              }}
              bgcolor={{
                xs: "#102637",
                md: "initial",
              }}
              borderTop={({ palette }) => ({
                xs: `2px solid ${palette.divider}`,
                md: 0,
              })}
              overflow='hidden'
              sx={{
                transition: "max-height 0.25s ease-in",
              }}
            >
              {!downMD && (
                <>
                  <Alerts {...alertProps} />
                  <AlertDashboard {...alertProps} />
                </>
              )}
              <Dashboard />
              {downMD && (
                <Button
                  startIcon={expanded ? <ExpandMore /> : <ExpandLess />}
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                  }}
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
