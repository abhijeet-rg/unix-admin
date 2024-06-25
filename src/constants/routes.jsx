import React from "react";
import WorkImageList from "../components/WorkImageList";
import Login from "../components/Login";
import ProtectedRoute from "../components/Projected";

const ROUTES = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <WorkImageList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/*",
    element: (
      <ProtectedRoute>
        <WorkImageList />
      </ProtectedRoute>
    ), // 404 is handled in WorkImageList component
  },
];

export default ROUTES;
