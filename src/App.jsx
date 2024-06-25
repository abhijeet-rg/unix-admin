import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { map } from "lodash";

import AuthProvider from "./hooks/useAuth";
import ROUTES from "./constants/routes";

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthProvider>
        <Router>
          <Routes>
            {map(ROUTES, (routeProps, i) => (
              <Route key={i} {...routeProps} />
            ))}
          </Routes>
        </Router>
      </AuthProvider>
    </Suspense>
  );
}

export default App;
