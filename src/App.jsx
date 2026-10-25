import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Projects from "./components/projects";
import PortfolioPage from "./pages/PortfolioPage";
import Servicespage from "./components/Services";
import Endpage from "./components/endpage";
import LoginPage from "./pages/login";
import AdminPage from "./pages/admin";
import ProtectedRoute from "./components/ProtectedRoute";
import AboutUsPage from "./pages/AboutUsPage";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  const location = useLocation();
  const standaloneRoutes = ["/login", "/admin"];

  const isStandalonePage = standaloneRoutes.some(path => 
    location.pathname.startsWith(path)
  );

  return (
    <div className="App">
      {/* Navbar only renders if we are NOT on the login page */}
      <ScrollToTop />
      {!isStandalonePage && <Navbar />}

      <Routes>
        <Route 
          path="/" 
          element={
            <>
              <Hero />
              <Projects />
              <Servicespage />
            </>
          } 
        />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<AboutUsPage />} />
      </Routes>

      {/* Endpage footer only renders if we are NOT on the login page */}
      {!isStandalonePage && <Endpage />}
    </div>
  );
}
