import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./components/Login";
import Menu from "./components/Menu";
import Cash from "./components/Cash";
import Admin from "./components/Admin";
import Reports from "./components/Reports";
import Hisaab from "./components/Hisaab";
import OwnerGate from "./components/OwnerGate";
import Navbar from "./components/Navbar";
import { ensureAuthDefaults } from "./utils/authDefaults";

export default function App() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    ensureAuthDefaults();
    const auth = localStorage.getItem("isAuth");
    if (auth === "true") {
      setIsAuth(true);
    }
  }, []);

  return (
    <BrowserRouter>
      {isAuth && <Navbar setIsAuth={setIsAuth} />}

      <Routes>
        <Route path="/" element={<Login setIsAuth={setIsAuth} />} />

        <Route
          path="/menu"
          element={isAuth ? <Menu /> : <Navigate to="/" />}
        />
        <Route
          path="/cash"
          element={isAuth ? <Cash /> : <Navigate to="/" />}
        />
        <Route
          path="/admin"
          element={
            isAuth ? (
              <OwnerGate>
                <Admin />
              </OwnerGate>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/reports"
          element={
            isAuth ? (
              <OwnerGate>
                <Reports />
              </OwnerGate>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/hisaab"
          element={
            isAuth ? (
              <OwnerGate>
                <Hisaab />
              </OwnerGate>
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}