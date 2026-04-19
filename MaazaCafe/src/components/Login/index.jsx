import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ensureAuthDefaults } from "../../utils/authDefaults";
import "./index.css";

export default function Login({ setIsAuth }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const login = () => {
    ensureAuthDefaults();
    const adminUser = localStorage.getItem("adminUser");
    const adminPass = localStorage.getItem("adminPass");

    if (!u || !p) return setErr("All fields required");

    if (u === adminUser && p === adminPass) {
  localStorage.setItem("isAuth", "true");   // ✅ ADD THIS
  setIsAuth(true);
  nav("/menu");
}else {
      setErr("Invalid credentials");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <div className="logo-container">
          <div className="logo">
            <img
              className="logo-image"
              src="https://imglink.cc/cdn/4G7S2SXJEE.jpeg"
              alt="Maaza Cafe logo"
            />
            <div className="logo-text">
              <h1>Maaza Cafe</h1>
              <p className="tagline">Made with love❤️</p>
            </div>
          </div>
        </div>

        <div className="welcome-section">
          <h2>Welcome to Maaza Cafe</h2>
          <p className="welcome-subtitle">Login as Admin</p>
        </div>

        <div className="form-container">
          <div className="input-group">
            <span className="input-icon">👤</span>
            <input 
              placeholder="Enter User ID" 
              onChange={(e) => setU(e.target.value)}
              value={u}
            />
          </div>

          <div className="input-group">
            <span className="input-icon">🔒</span>
            <input 
              type="password" 
              placeholder="Enter Password" 
              onChange={(e) => setP(e.target.value)}
              value={p}
            />
          </div>

          {err && <p className="error">{err}</p>}

          <button onClick={login} className="login-btn">Login</button>
        </div>
      </div>

      <div className="login-right">
        <div className="featured-food">
          <img src="https://img.freepik.com/premium-photo/delicious-indian-food-spread-with-biryani-curry-naan_1410957-18149.jpg" alt="Asian Cuisine" className="food-image-tag" />
          <div className="food-overlay">
          </div>
        </div>
      </div>
    </div>
  );
}
