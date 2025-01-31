import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("Token"));

  const location = useLocation();
  const navigate = useNavigate();

  // Toggle the menu on button click
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Close the menu when a link is clicked
  const closeMenu = () => setIsMenuOpen(false);

  // Logout function
  const logout = () => {
    localStorage.removeItem("Token");
    window.dispatchEvent(new Event("storage")); // Notify token update
    setIsLoggedIn(false);
    navigate("/login");
  };

  // Listen for login/logout state changes
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("Token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <nav className="navbar">
      <a href="/" className="logo">
        <img src="/public/Logo.JPG" alt="Logo" />
      </a>

      {/* Menu button, visible on mobile */}
      <button className="menu-btn" onClick={toggleMenu}>
        <Menu />
      </button>

      {/* Links list, shown when the menu is active */}
      <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
        <li>
          <Link to="/" onClick={closeMenu}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/adoption" onClick={closeMenu}>
            Adoption
          </Link>
        </li>
        <li>
          <Link to="/rescue" onClick={closeMenu}>
            Rescue
          </Link>
        </li>
        <li>
          <Link to="/appointments" onClick={closeMenu}>
            Appointments
          </Link>
        </li>
        <li>
          <Link to="/blog" onClick={closeMenu}>
            Blog
          </Link>
        </li>
        <li>
          <Link to="/userprofile" onClick={closeMenu}>
            Profile
          </Link>
        </li>
      </ul>

      {/* Logout Button */}
      {isLoggedIn && (
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      )}
    </nav>
  );
}
