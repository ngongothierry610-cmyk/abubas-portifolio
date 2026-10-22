import { useState } from "react";
import { projects, getVideoSrc, getThumb } from "../projectsData";
import VideoModal from "../components/VideoModal";

export default function PortfolioPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeVideoId, setActiveVideoId] = useState(null);

  return (
    <div className="portfolio-page-container">
      <h1>Portfolio Page</h1>
      <input
        type="text"
        placeholder="Search projects..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <p>Welcome to our portfolio page. Here you can find our latest projects and works.</p>

      <div className="projects-grid">
        {projects
          .filter(
            (project) =>
              project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              project.category.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((project) => (
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

      {/* One modal, outside the grid */}
      <VideoModal
        videoUrl={activeVideoId}
        onClose={() => setActiveVideoId(null)}
      />
    </div>
  );
}