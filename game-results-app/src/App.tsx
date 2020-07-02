import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
// javascript plugin used to create scrollbars on windows
// import PerfectScrollbar from "perfect-scrollbar";

// core components
import Sidebar from "./components/Sidebar/Sidebar.js";
import routes from "./routes";
import logo from "./assets/img/react-logo.png";
import TopNavbar from "./components/TopNavbar";

// var ps;
type AppProps = {
  location: { pathname: string }
}

type AppState = {
  backgroundColor: string,
  //sidebarOpened: 
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      backgroundColor: "blue",
      // sidebarOpened:
      //   document.documentElement.className.indexOf("nav-open") !== -1
    };
  }
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      document.documentElement.className += " perfect-scrollbar-on";
      document.documentElement.classList.remove("perfect-scrollbar-off");
      // ps = new PerfectScrollbar(this.refs.mainPanel, { suppressScrollX: true });
      let tables = document.querySelectorAll(".table-responsive");
      // for (let i = 0; i < tables.length; i++) {
      //   ps = new PerfectScrollbar(tables[i]);
      // }
    }
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      // ps.destroy();
      document.documentElement.className += " perfect-scrollbar-off";
      document.documentElement.classList.remove("perfect-scrollbar-on");
    }
  }
  componentDidUpdate(e: any) {
    if (e.history.action === "PUSH") {
      if (navigator.platform.indexOf("Win") > -1) {
        let tables = document.querySelectorAll(".table-responsive");
        // for (let i = 0; i < tables.length; i++) {
        //   ps = new PerfectScrollbar(tables[i]);
        // }
      }
      // document.documentElement.scrollTop = 0;
      // document.scrollingElement.scrollTop = 0;
      // this.refs.mainPanel.scrollTop = 0;
    }
  }
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
            bgColor={this.state.backgroundColor}
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
              <Redirect from="*" to="/dashboard"/>
            </Switch>
          </div>
        </div>
      </>
    );
  }
}

export default App;