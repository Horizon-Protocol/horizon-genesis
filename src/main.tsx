import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { Provider as JotaiProvider } from "jotai";
import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from "@material-ui/styles";
import { SnackbarProvider } from "notistack";
import "@fontsource/raleway";
import { Web3ReactProvider } from "@web3-react/core";
import theme from "@utils/theme";
import { getLibrary } from "@utils/web3React";
import "./index.css";
import App from "./App";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      enabled: false,
      staleTime: Infinity,
      refetchInterval: 30000,
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
          <ThemeProvider theme={theme}>
            <SnackbarProvider
              anchorOrigin={{
                horizontal: "right",
                vertical: "top",
              }}
              preventDuplicate
            >
              <App />
            </SnackbarProvider>
          </ThemeProvider>
        </Web3ReactProvider>
      </QueryClientProvider>
    </JotaiProvider>
  </StrictMode>,
  document.getElementById("root")
);
