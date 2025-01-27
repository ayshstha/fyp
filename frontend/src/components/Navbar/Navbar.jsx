import { useState } from "react";
import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const location = useLocation();

  // Toggle the menu on button click
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Close the menu when a link is clicked
  const closeMenu = () => setIsMenuOpen(false);

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

      {/* Sign-in button, remains outside the menu */}
      <Link to="/login">
        <button className="signup-btn">Sign In</button>
      </Link>
    </nav>
  );
}
