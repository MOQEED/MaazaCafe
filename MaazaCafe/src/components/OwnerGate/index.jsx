import { useState, useEffect } from "react";
import "./index.css";

export default function OwnerGate({ children }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(() => localStorage.getItem("ownerAuth") === "true");

  useEffect(() => {
    setOk(localStorage.getItem("ownerAuth") === "true");
  }, []);

  const login = () => {
    const ou = localStorage.getItem("ownerUser");
    const op = localStorage.getItem("ownerPass");
    if (!u || !p) {
      setErr("Enter owner user ID and password");
      return;
    }
    if (u === ou && p === op) {
      localStorage.setItem("ownerAuth", "true");
      setOk(true);
      setErr("");
      setU("");
      setP("");
    } else {
      setErr("Invalid owner credentials");
    }
  };

  if (!ok) {
    return (
      <div className="owner-gate-wrap">
        <div className="owner-gate-card">
          <h2>Owner&apos;s area</h2>
          <p className="owner-gate-hint">
            Admin, Reports, and Hisaab use the same owner login (separate from the main app login).
          </p>
          <input
            placeholder="Owner user ID"
            value={u}
            onChange={(e) => setU(e.target.value)}
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Owner password"
            value={p}
            onChange={(e) => setP(e.target.value)}
            autoComplete="current-password"
            onKeyDown={(e) => e.key === "Enter" && login()}
          />
          {err && <p className="owner-gate-err">{err}</p>}
          <button type="button" className="owner-gate-btn" onClick={login}>
            Unlock
          </button>
        </div>
      </div>
    );
  }

  return children;
}
