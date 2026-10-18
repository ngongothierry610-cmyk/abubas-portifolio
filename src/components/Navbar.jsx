import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const isPortfolio = location.pathname === "/portfolio";

  return (
    <nav className="navbar">
      <div className="logo">
        <h2>Visual<span> Art</span></h2>
      </div>
      <div className="nav-links">
        {isPortfolio ? (
          <Link to="/">Home</Link>
        ) : (
          <>
            <a href="#about">About</a>
            <Link to="/portfolio">Portfolio</Link>
          </>
        )}
        <a href="#contact">Contact</a>
      </div>
    </nav>
  );
}