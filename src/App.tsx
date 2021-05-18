import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Mint from "@pages/mint";
import Burn from "@pages/burn";
import Claim from "@pages/claim";
import Earn from "@pages/earn";
import Header from "@components/Header";

function App() {
  return (
    <Router>
      <Header />

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
    </Router>
  );
}

export default App;
