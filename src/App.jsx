// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import PortfolioPage from "./pages/PortfolioPage";
import AboutPage from "./components/About";

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
              
            </>
          } 
        />
        <Route 
          path="/portfolio" 
          element={<PortfolioPage />} 
        />
      </Routes>
    </div>
  );
}