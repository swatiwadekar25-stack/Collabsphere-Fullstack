
import { Link, useParams } from "react-router-dom";

export default function PublicProject({ projects }) {
  const { id } = useParams();
  const project = projects.find((item) => item.id === id);

  if (!project) {
    return (
      <main className="public-page">
        <h1>Project not found</h1>
        <p>This project is not available in this demo.</p>
        <Link to="/" className="text-link">Go to CollabSphere</Link>
      </main>
    );
  }

  return (
    <main className="public-page">
      <Link className="brand" to="/">
        <span className="brand-mark">C</span>
        <span>Collab<span className="brand-accent">Sphere</span></span>
      </Link>

      <span className="eyebrow public-label">PUBLIC PROJECT PREVIEW</span>
      <h1>{project.name}</h1>
      <p className="public-description">{project.description}</p>

      <h2>Technologies</h2>
      <div className="tag-list">
        {project.technologies.map((technology) => (
          <span className="tag" key={technology}>{technology}</span>
        ))}
      </div>

      <div className="alert alert-info">
        This is a frontend demo. Public access and permissions must be
        enforced by the backend before deploying.
      </div>
    </main>
  );
}
