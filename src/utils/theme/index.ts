import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    // type: "dark",
    primary: {
      main: "#62B5DB",
    },
    secondary: {
      main: "rgba(98,181,219, 0.1)",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#C1D3E0",
    },
    background: {
      default: "#120C1C",
      paper: "#131D34",
    },
    divider: "#1E4267",
  },
  typography: {
    fontFamily: [
      "Raleway",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
});

export default theme;
