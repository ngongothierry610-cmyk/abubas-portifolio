import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import black from "../assets/us/black.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const { pathname } = useLocation();

  // If already on the home page, scroll smoothly to the top
  const goHome = () => {
    close();
    if (pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/" className="logo-link" onClick={goHome}>
          <img src={black} alt="Visual Art Logo" className="brand-logo" />
        </Link>
      </div>

      <button
        className={`menu-toggle ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`nav-links ${open ? "open" : ""}`}>
        <Link to="/" onClick={goHome}>Home</Link>
        <Link to="/about" onClick={close}>About</Link>
        <Link to="/portfolio" onClick={close}>Portfolio</Link>
        <a href="#contact" onClick={close}>Contact</a>
      </div>
    </nav>
  );
}