// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import PortfolioPage from "./pages/PortfolioPage";
import AboutPage from "./components/About";
import Servicespage from "./components/Services";
import endpage from "./components/endpage";
import Endpage from "./components/endpage";

export default function App() {
  return (
    <div className="App">
      <Navbar />

      <Routes>
        <Route 
          path="/" 
          element={
            <>
              <Hero />
              <AboutPage />
              <Projects />
              <Servicespage />
              
            </>
          } 
        />
        <Route 
          path="/portfolio" 
          element={<PortfolioPage />} 
        />
      </Routes>
      <Endpage />
    </div>
  );
}