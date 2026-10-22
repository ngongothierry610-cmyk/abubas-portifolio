import { useState } from "react";
import { projects, getVideoSrc, getThumb } from "../projectsData";
import VideoModal from "./VideoModal";

export default function Projects() {
  const [activeVideoId, setActiveVideoId] = useState(null);

  return (
    <section className="projects-section" id="projects">
      <h2>Featured Projects</h2>
      <div className="projects-grid">
        {projects.filter((p) => p.featured).map((project) => (
          <div
            key={project.id}
            className="project-card"
            onClick={() => setActiveVideoId(getVideoSrc(project))}
          >
            <img src={getThumb(project)} alt={project.title} />
            <div className="project-info">
              <span className="category">{project.category}</span>
              <h3>{project.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* One modal only, outside the map and outside the cards */}
      <VideoModal
        videoUrl={activeVideoId}
        onClose={() => setActiveVideoId(null)}
      />
    </section>
  );
}