import React from "react";
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from "react-router-dom";
// javascript plugin used to create scrollbars on windows
// import PerfectScrollbar from "perfect-scrollbar";

// core components
import Sidebar from "./components/Sidebar/Sidebar.js";
import routes from "./routes";
import logo from "./assets/img/react-logo.png";
import TopNavbar from "./components/TopNavbar";

import { setMatches, selectScreenName, setSelectedPlayer } from './features/appSlice';
import axios from 'axios';
import { IPlayer } from './components/MatchTable';
import {
  JsonHubProtocol,
  HubConnectionState,
  HubConnectionBuilder,
  LogLevel
} from '@microsoft/signalr';

// var ps;
type AppProps = {
  location: { pathname: string },
  setMatches: (data: any) => {},
  selectScreenName: () => string | undefined,
  setSelectedPlayer: (player: IPlayer) => {}
}

type AppState = {
  backgroundColor: string,
}

const connectionHub = "matchhub"

const options = {
  logMessageContent: true,
  logger: true ? LogLevel.Warning : LogLevel.Error
};

class App extends React.Component<AppProps> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      backgroundColor: "blue",
    };

  }

  // const App = (props: AppProps) => {
  componentDidMount() {
      const connection = new HubConnectionBuilder()
      .withUrl(connectionHub, options)
      .withAutomaticReconnect()
      .withHubProtocol(new JsonHubProtocol())
      .configureLogging(LogLevel.Information)
      .build();

    this.startSignalRConnection(connection);

    this.getData();

    if(this.props.location.pathname.includes("user-matches")){
      this.props.setSelectedPlayer({screenName: this.props.location.pathname.split("/")[2]});
    }
  }

  getData = () => {
    let strPath = 'api/matches';

    axios.get(strPath)
    .then(res => {
      const matches = res.data;
      this.props.setMatches(matches);
    });
  }

  startSignalRConnection = async (connection: any) => {
    try {
      connection.on('NewResultsAvailable', () => {
        this.getData();
      })
      await connection.start();
      console.assert(connection.state === HubConnectionState.Connected);
      console.log('SignalR connection established');
    } catch (err) {
      console.assert(connection.state === HubConnectionState.Disconnected);
      console.error('SignalR Connection Error: ', err);
      setTimeout(() => this.startSignalRConnection(connection), 5000);
    }
  };

  // this function opens and closes the sidebar on small devices
  toggleSidebar = () => {
    // document.documentElement.classList.toggle("nav-open");
    // this.setState({ sidebarOpened: !this.state.sidebarOpened });
  };
  getRoutes = (routes: any[]) => {
    return routes.map((prop, key) => {
      return (
        <Route
          path={prop.path}
          component={prop.component}
          key={key}
        />
      );
    });
  };
  getPageTitle = (path: any) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        this.props.location.pathname.indexOf(
          routes[i].path
        ) !== -1
      ) {
        return routes[i].name;
      }
    }
    return "";
  };
  render() {
    return (
      <>
        <div className="wrapper">
          <Sidebar
            {...this.props}
            routes={routes}
            bgColor={"blue"}
            logo={{
              text: "Matches Demo",
              imgSrc: logo
            }}
            toggleSidebar={this.toggleSidebar}
          />
          <div
            className="main-panel"
            ref="mainPanel"
          // data={this.state.backgroundColor}
          >
            <TopNavbar
              {...this.props}
              brandText={this.getPageTitle(this.props.location.pathname)}
            />
            <Switch>
              {this.getRoutes(routes)}
              <Redirect from="*" to="/dashboard" />
            </Switch>
          </div>
        </div>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    // dispatching plain actions
    setMatches: (data: any) => dispatch(setMatches(data)),
    selectScreenName: ():string => dispatch(selectScreenName),
    setSelectedPlayer: (player: IPlayer) => dispatch(setSelectedPlayer)
  }
}

export default connect(null, mapDispatchToProps)(App);