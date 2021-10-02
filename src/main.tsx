import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider as JotaiProvider } from "jotai";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import { Web3ReactProvider } from "@web3-react/core";
import "@fontsource/raleway";
import "@assets/fonts/rawline-400.woff2";
import theme from "@utils/theme";
import { getLibrary } from "@utils/web3React";
import { REACT_QUERY_DEFAULT_OPTIONS } from "@utils/constants";
import "./index.css";
import App from "./App";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      ...REACT_QUERY_DEFAULT_OPTIONS,
      enabled: false,
    },
    mutations: {
      useErrorBoundary: true,
    },
  },
});

ReactDOM.render(
  <StrictMode>
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <StyledEngineProvider injectFirst>
            <CssBaseline />
            <ThemeProvider theme={theme}>
              <SnackbarProvider
                anchorOrigin={{
                  horizontal: "right",
                  vertical: "top",
                }}
                preventDuplicate
              >
                <Router>
                  <App />
                </Router>
              </SnackbarProvider>
            </ThemeProvider>
          </StyledEngineProvider>
        </Web3ReactProvider>
        {/* The rest of your application */}
        <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
    </JotaiProvider>
  </StrictMode>,
  document.getElementById("root")
);
