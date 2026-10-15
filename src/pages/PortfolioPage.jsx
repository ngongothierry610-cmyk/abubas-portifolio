import { projects } from "../projectsData";

export default function PortfolioPage() {
  return (
    <div className= "portfolio-page-container">
        <h1>Portfolio Page</h1>
        <input type="text" placeholder="Search projects..." />
        <p>Welcome to our portfolio page. Here you can find our latest projects and works.</p>
        <div className="projects-grid">
            {projects.map((project) => (
                <div key={project.id} className="project-card">
                    <img src={project.image} alt={project.title} />
                    <div className="project-info">
                        <span className="category">{project.category}</span>
                        <h3>{project.title}</h3>
                    </div>
                </div>
            ))}
        </div>
    </div>
  ); 
}
           