import { createBrowserRouter, useNavigate } from "react-router-dom";
import { HomeLayout } from "./components";
import { Conversation, Home } from "./pages";

export const Authenticated = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/home",
        element: <Home />,
      },
    ],
  },
  {
    path: "user/:id?",
    element: (
      //<RequireAuth>
      <Conversation />
      //</RequireAuth>
    ),
  },
]);
