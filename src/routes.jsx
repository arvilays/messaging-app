import App from "./App";
import Welcome from "./views/Welcome";
import Dashboard from "./views/Dashboard";
// import Home from "./views/Home";
// import Play from "./views/Play";
// import Leaderboard from "./views/Leaderboard";
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
    // children: [
    //   {
    //     index: true,
    //     element: <Welcome />,
    //   },
    //   {
    //     path: "play/:slug?",
    //     element: <Play />,
    //   },
    //   {
    //     path: "leaderboard/:slug?",
    //     element: <Leaderboard />,
    //   },
    // ],
  },
];

export default routes;