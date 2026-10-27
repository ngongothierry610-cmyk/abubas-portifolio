import { useState, useEffect } from "react";
import { useProjects, getThumb } from "../useProjects";

export default function Hero() {
  const { projects } = useProjects();
  const slides = projects.filter((p) => p.featured);
  const [current, setCurrent] = useState(0);

  // Change slide every 5 seconds (restarts when you click a dot)
  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [current, slides.length]);

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="hero-section" id="home">
      <div className="hero-slides">
        {slides.map((project, i) => {
          const thumbUrl = getThumb(project);
          return (
            <div
              key={project.id}
              className={`hero-slide ${i === current ? "active" : ""}`}
            >
            <img
              src={getThumb(project)}
              alt={project.title}
              className="hero-slide-img"
              onLoad={(e) => {
                // If YouTube returned the 120px 3-dotted grey error box
                if (e.target.naturalWidth === 120) {
                  if (project.youtube_id) {
                    // Fall back to standard hqdefault thumbnail for this specific video
                    e.target.src = `https://img.youtube.com/vi/${project.youtube_id}/hqdefault.jpg`;
                  }
                }
              }}
              onError={(e) => {
                if (project.youtube_id) {
                  e.target.src = `https://img.youtube.com/vi/${project.youtube_id}/hqdefault.jpg`;
                } else {
                  e.target.src = "/logo.png";
                }
              }}
            />
            </div>
          );
        })}
      </div>

      <div className="hero-overlay"></div>

      <div className="hero-content">
        <h1>
          Welcome to Visual <span style={{ color: "#e50914" }}>Arts</span> Portfolio
        </h1>
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