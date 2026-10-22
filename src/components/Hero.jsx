import { useState, useEffect } from "react";
import { projects, getThumb } from "../projectsData";

const slides = projects.filter((p) => p.featured);

export default function Hero() {
  const [current, setCurrent] = useState(0);

  // Change slide every 5 seconds (restarts when you click a dot)
  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [current]);

  const scrollTo = (id) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="hero-section" id="home">
      <div className="hero-slides">
        {slides.map((project, i) => (
          <div
            key={project.id}
            className={`hero-slide ${i === current ? "active" : ""}`}
            style={{ backgroundImage: `url(${getThumb(project)})` }}
          />
        ))}
      </div>
      <div className="hero-overlay"></div>

      <div className="hero-content">
        <h1>Welcome to Our Portfolio</h1>
        <p>Discover our latest projects and innovations.</p>
        <button onClick={() => scrollTo("projects")}>View Projects</button>
        <button onClick={() => scrollTo("contact")}>Contact Us</button>
      </div>

      {slides.length > 1 && (
        <div className="hero-dots">
          {slides.map((project, i) => (
            <span
              key={project.id}
              className={`hero-dot ${i === current ? "active" : ""}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
      )}
    </section>
  );
}