import { useState } from "react";
import { Link } from "react-router-dom";
import { useProjects, getVideoSrc, getThumb } from "../useProjects";
import VideoModal from "./VideoModal";

export default function Projects() {
  const [activeVideoId, setActiveVideoId] = useState(null);
  const { projects, loading } = useProjects();
  return (
    <section className="projects-section" id="projects">
      <h2>Featured Projects</h2>
      {loading && <p>Loading projects...</p>}
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
      <div className="view-all-wrap">
        <Link to="/portfolio" className="view-all-btn">View All Projects</Link>
      </div>
      
      <VideoModal
        videoUrl={activeVideoId}
        onClose={() => setActiveVideoId(null)}
      />
    </section>
  );
}