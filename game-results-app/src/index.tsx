import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { store } from './app/store';

import "./assets/scss/black-dashboard-react.scss";
import "./assets/demo/demo.css";
import "./assets/css/nucleo-icons.css";

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

// import { createBrowserHistory } from "history";

// const hist = createBrowserHistory();

ReactDOM.render(
  <Provider store={store}>
    <Router>
    <Switch>
      <Route path="/" render={(props: any) => <App {...props} />} />
      {/* <Redirect from="/" to="/dashboard" /> */}
    </Switch>
  </Router>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
