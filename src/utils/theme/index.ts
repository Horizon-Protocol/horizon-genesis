import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
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
});

export default theme;
