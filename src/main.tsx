import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { Provider as JotaiProvider } from "jotai";
import { ThemeProvider } from "@material-ui/styles";
import { SnackbarProvider } from "notistack";
import "@fontsource/roboto";
import "@fontsource/roboto-condensed";
import { UseWalletProvider } from "@binance-chain/bsc-use-wallet";
import theme from "@utils/theme";
import { ChainId } from "@utils/constants";
import "./index.css";
import App from "./App";

ReactDOM.render(
  <StrictMode>
    <JotaiProvider>
      {/* children */}
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          anchorOrigin={{
            horizontal: "right",
            vertical: "top",
          }}
          preventDuplicate
        >
          <UseWalletProvider chainId={ChainId}>
            <App />
          </UseWalletProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </JotaiProvider>
  </StrictMode>,
  document.getElementById("root")
);
