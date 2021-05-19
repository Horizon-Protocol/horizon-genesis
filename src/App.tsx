import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Mint from "@pages/mint";
import Burn from "@pages/burn";
import Claim from "@pages/claim";
import Earn from "@pages/earn";
import Header from "@components/Header";
import Dashboard from "@components/Dashboard";

const useStyles = makeStyles(() => ({
  dashboard: {
    position: "fixed",
    top: 100,
    right: 24,
  },
}));

function App() {
  const classes = useStyles();

  return (
    <Router>
      <Header />
      <Dashboard hidden className={classes.dashboard} />
      <Box mt={3}>
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
    </Router>
  );
}

export default App;
