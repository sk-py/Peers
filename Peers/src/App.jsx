import { useState } from "react";
import Auth from "./Components/Auth";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Toggle from "./Components/Toggle";
import Home from "./Components/Home";
import ProtectedRoute from "./Components/ProtectedRoute";
// import MobileNav from "./Components/MobileNav";
("react-router-dom");
// import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* <Toggle /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth isSignInPage="false" />}></Route>
          <Route path="/signIn" element={<Auth isSignInPage="" />}></Route>
          {/* <Route Component={<ProtectedRoutes />}>
            <Route Component={<Home />} path="/Home" />
          </Route> */}
          <Route
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
            path="/"
          ></Route>
          {/* <Route path="/home" element={<Home />}></Route> */}
        </Routes>
      </BrowserRouter>
      {/* <MobileNav /> */}
    </>
  );
}

export default App;
