import { useEffect, useState } from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import * as ReactGA from "react-ga";
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
  Popover,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { footerMenuWalletInfoOpenAtom, readyAtom } from "@atoms/app";
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
import Record from "@components/Record";
import DebtTracker from "@pages/DebtTracker";
import Escrow from "@pages/Escrow";
import History from "@pages/History";
import useQueryDebt from "@hooks/query/useQueryDebt";
import useQueryGlobalDebt from "@hooks/query/useQueryGlobalDebt";
import useEscrowDataQuery from "@hooks/Escrowed/useEscrowDataQuery";
import useIsMobile from "@hooks/useIsMobile";
import MobileMenu from "@components/MobileFooter";
import WalletsDialog from "@components/Header/WalletsDialog";
import useSuspensionStatus from "@hooks/useSuspensionStatus";
import GetHZNDialog from "@components/MobileFooter/MobileMenu/GetHZNDialog";
import useEstimatedStakingRewards from "@hooks/useEstimatedStakingRewards";
import DevWatchTool from "@components/DevWatchTool";

const AppDisabled = !!import.meta.env.VITE_APP_DISABLED;

if (import.meta.env.PROD) {
  ReactGA.initialize("UA-199967475-1", {
    // debug: true,
  });
  ReactGA.pageview(window.location.pathname + window.location.search);
}

function App() {
  const { breakpoints } = useTheme();
  const downLG = useMediaQuery(breakpoints.down("lg"));
  const isMobile = useIsMobile()
  const isEarnPage = useIsEarnPage();
  const walletInfoOpen = useAtomValue(footerMenuWalletInfoOpenAtom)
  const { pathname } = useLocation();

  const appReady = useAtomValue(readyAtom);

  const [expanded, setExpanded] = useState(false);

  useSetupHorizonLib();
  
  useSuspensionStatus();
  useFetchHorizonData();

  // useEstimatedStakingRewards(); 
  // useFetchAppData();
  // useFetchDebtData();
  // useFetchZAssetsBalance();
  // useFetchFeePool();
  // useFetchRewards();
  // useEscrowDataQuery();

  const refresh = useRefresh();

  useEffect(() => {
    // scroll to top when route changes
    if (isMobile) {
      window.scrollTo(0, 0);
    }
  }, [pathname, isMobile]);

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
      xs: 0,
      md: 0,
    },
    mb: {
      xs: 0,
      md: 2,
    },
    mx: {
      xs: 0,
      sm: 0,
      md: 0,
    },
  };

  const recordProps: BoxProps = {
    mb: 0,
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
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Typography
            variant="h3"
            color="textPrimary"
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
        {!isMobile && <Header />}
        {!isEarnPage && isMobile && (
          <>
            <Alerts {...alertProps} />
          </>
        )}
        {!isEarnPage && downLG && !isMobile && <Record {...recordProps} />}
        <Box
          my={isMobile ? '1px' : '44px'}
          display="flex"
          justifyContent="center"
          flexWrap={{
            xs: "wrap",
            md: "nowrap",
          }}
        >
          {!isEarnPage && (
            <Hidden lgDown>
              <Box
                position="relative"
                width="100%"
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
            m={{
              md: "0 30px 0 30px",
            }}
            mb={isMobile ? '50px' : '2px'}
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
                  sm: 640,
                }
            }
          >
            <Switch>
              <Route
                exact
                path="/"
                render={() => <Redirect to="/home" push />}
              />
              <Route path="/home">
                <Home />
              </Route>
              <Route path="/burn">
                <Burn />
              </Route>
              <Route path="/claim">
                <Claim />
              </Route>
              <Route path="/earn">
                <Earn />
              </Route>
              <Route path="/mint">
                <Mint />
              </Route>
              <Route path="/debtTracker">
                <DebtTracker />
              </Route>
              <Route path="/escrow">
                <Escrow />
              </Route>
              <Route path="/history">
                <History />
              </Route>
            </Switch>
          </Box>
          {isMobile && <MobileMenu />}
          {!(isEarnPage && !isMobile) && (
            <Box
              pr={
                {
                  // xs: 0,
                  // sm: 0,
                  // md: 1,
                  // lg: 2,
                }
              }
              position={{
                // xs: "fixed",
                // sm: "fixed",
                md: "static",
              }}
              left={0}
              right={0}
              // bottom={{
              //   xs: "2.75rem",
              //   sm: "2.75rem",
              // }}
              zIndex={3}
              width={{
                // xs: "100%",
                // sm: "100%",
                md: 300,
              }}
              minWidth={{
                // xs: "100%",
                // sm: "100%",
                md: 300,
              }}
              maxHeight={{
                // xs: walletInfoOpen ? '100%' : '0px',
                // sm: walletInfoOpen ? '100%' : '0px',
                md: '100%',
              }}
              bgcolor={{
                // xs: "#102637",
                md: "initial",
              }}
              borderTop={({ palette }) => ({
                // xs: `2px solid ${palette.divider}`,
                md: 0,
              })}
              overflow="hidden"
              display={{
                xs: 'none',
                sm: 'none',
                md: 'block'
              }}
              sx={{
                transition: "max-height 0.25s ease-in",
              }}
            >
              {!isMobile && (
                <>
                  <Alerts {...alertProps} />
                </>
              )}
              <Dashboard />
            </Box>
          )}
        </Box>
      </Box>
      <WalletsDialog />
      <GetHZNDialog />
      {/* <DevWatchTool /> */}
    </>
  );
}

export default App;
