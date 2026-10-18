// src/components/Projects.jsx
import { projects } from "../projectsData";

export default function Projects() {
  return (
    <section className="projects-section" id="projects">
      <h2>Featured Projects</h2>
      <div className="projects-grid">
        {projects.filter(p => p.featured).map((project) => (
          <div key={project.id} className="project-card">
            <img src={project.image} alt={project.title} />
            <div className="project-info">
              <span className="category">{project.category}</span>
              <h3>{project.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}