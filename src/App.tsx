import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Mint from "@pages/mint";
import Burn from "@pages/burn";
import Claim from "@pages/claim";
import Earn from "@pages/earn";
import "./App.css";
import NavTabs from "./components/NavTabs";

function App() {
  return (
    <Router>
      <div>
        <NavTabs />
      </div>

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
