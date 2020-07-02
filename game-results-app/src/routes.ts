/*!

=========================================================
* Black Dashboard React v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "./views/Dashboard";
import UserProfile from "./views/UserProfile";
import { UserMatches } from './views/UserMatches';

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "tim-icons icon-chart-pie-36",
    component: Dashboard,
  },
  {
    path: "/user-matches",
    name: "User Matches",
    icon: "tim-icons icon-single-02",
    component: UserMatches,
  },
  {
    path: "/submit-match-results",
    name: "Submit Match Results",
    icon: "tim-icons icon-pencil",
    component: UserProfile,
  }
];
export default routes;
