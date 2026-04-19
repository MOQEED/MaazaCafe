import { Link, useNavigate } from "react-router-dom";
import './index.css'

export default function Navbar({ setIsAuth }) {
  const nav = useNavigate();

  const logout = () => {
    localStorage.removeItem("isAuth");
    localStorage.removeItem("ownerAuth");
    setIsAuth(false);
    nav("/");
  };
  return (
    <div className="navbar">
      <img
              className="logo-image"
              src="https://imglink.cc/cdn/4G7S2SXJEE.jpeg"
              alt="Maaza Cafe logo"
            />
      <Link to="/menu">Menu</Link>
      <Link to="/cash">Cash</Link>
      <Link to="/admin">Admin</Link>
      <Link to="/reports">Reports</Link>
      <Link to="/hisaab">Hisaab</Link>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

