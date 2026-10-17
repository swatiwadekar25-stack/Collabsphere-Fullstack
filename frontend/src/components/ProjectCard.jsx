
import { Link } from "react-router-dom";

export default function ProjectCard({ project, onDelete }) {
  return (
    <article className="project-card">
      <div className="project-card-top">
        <div className={`project-icon project-color-${project.color || 1}`}>
          {project.name?.charAt(0).toUpperCase() || "P"}
        </div>
        <button
          className="icon-button"
          title="Delete project"
          onClick={() => onDelete(project.id)}
        >
          ⋯
        </button>
      </div>

      <Link to={`/projects/${project.id}`} className="project-title">
        {project.name}
      </Link>

      <p className="project-description">
        {project.description || "No description added yet."}
      </p>

      <div className="tag-list">
        {(project.technologies || []).slice(0, 3).map((technology) => (
          <span className="tag" key={technology}>
            {technology}
          </span>
        ))}
      </div>

      <div className="project-card-footer">
        <span>◷ Updated recently</span>
        <Link to={`/projects/${project.id}`} className="text-link">
          Open project →
        </Link>
      </div>
    </article>
  );
}
