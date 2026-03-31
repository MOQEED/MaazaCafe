import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";   // ✅ ADD THIS

import Login from "./components/Login";
import Menu from "./components/Menu";
import Cash from "./components/Cash";
import Admin from "./components/Admin";
import Reports from "./components/Reports";
import Navbar from "./components/Navbar";

export default function App() {
  const [isAuth, setIsAuth] = useState(false);

  // ✅ LOAD AUTH STATE FROM LOCALSTORAGE
  useEffect(() => {
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
          element={isAuth ? <Admin /> : <Navigate to="/" />}
        />
        <Route
          path="/reports"
          element={isAuth ? <Reports /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}