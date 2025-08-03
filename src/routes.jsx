import App from "./App";
import Welcome from "./views/Welcome";
import Dashboard from "./views/Dashboard";
import ErrorPage from "./views/ErrorPage";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Welcome />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      }
    ],
  },
];

export default routes;