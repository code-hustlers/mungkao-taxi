import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Signin, Home } from "../views";

const AppRouter = () => (
  <Router>
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/signin/">Signin</Link>
          </li>
        </ul>
      </nav>

      <Route path="/" exact component={Home} />
      <Route path="/signin/" component={Signin} />
    </div>
  </Router>
);

export default AppRouter;
