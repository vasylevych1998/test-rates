import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import Rates from './pages/Rates';
import Result from './pages/Result';

class App extends Component {
  render() {
    return (
      <Router>
        <Container>
          <Switch>
            <Route exact path="/rates" component={Rates} />
            <Route exact path="/result" component={Result} />
            <Redirect to="/rates" />
          </Switch>
        </Container>
      </Router>
    );
  }
}

export default App;
