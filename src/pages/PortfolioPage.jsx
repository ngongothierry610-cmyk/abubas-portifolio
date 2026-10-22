import { useState, useMemo } from "react";
import { useProjects, getVideoSrc, getThumb } from "../useProjects";
import VideoModal from "../components/VideoModal";

export default function PortfolioPage() {
  const { projects, loading } = useProjects();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [activeVideoId, setActiveVideoId] = useState(null);

  // Tabs come from the categories that really exist in your data
  const categories = useMemo(
    () => [...new Set(projects.map((p) => p.category))],
    [projects]
  );

  // If the selected category no longer exists, fall back to All
  const current =
    activeCategory === "All" || categories.includes(activeCategory)
      ? activeCategory
      : "All";

  const visible = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const list = projects.filter(
      (p) =>
        (current === "All" || p.category === current) &&
        (p.title.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term))
    );
    return [...list].sort((a, b) => {
      if (sortBy === "oldest") return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return new Date(b.created_at) - new Date(a.created_at); // newest
    });
  }, [projects, current, searchTerm, sortBy]);

  return (
    <div className="portfolio-page-container">
      <h1>Portfolio Page</h1>
      <p>Welcome to our portfolio page. Here you can find our latest projects and works.</p>

      <div className="portfolio-toolbar">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="title">Title A–Z</option>
        </select>
      </div>

      <div className="category-tabs">
        <button
          className={current === "All" ? "active" : ""}
          onClick={() => setActiveCategory("All")}
        >
          All ({projects.length})
        </button>
        {categories.map((c) => (
          <button
            key={c}
            className={current === c ? "active" : ""}
            onClick={() => setActiveCategory(c)}
          >
            {c} ({projects.filter((p) => p.category === c).length})
          </button>
        ))}
      </div>

      {loading && <p>Loading projects...</p>}
      {!loading && visible.length === 0 && <p>No projects found.</p>}

      <div className="projects-grid">
        {visible.map((project) => (
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

      <VideoModal
        videoUrl={activeVideoId}
        onClose={() => setActiveVideoId(null)}
      />
    </div>
  );
}