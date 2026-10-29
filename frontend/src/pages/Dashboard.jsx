
import { Link } from "react-router-dom";
import ProjectCard from "../components/ProjectCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard({ projects, onDelete }) {
  const { user } = useAuth();

  const stats = [
    { label: "Total projects", value: projects.length, icon: "▦" },
    { label: "Markdown notes", value: 0, icon: "▤" },
    { label: "Shared files", value: 0, icon: "⌘" },
    { label: "AI requests", value: 0, icon: "✦" },
  ];

  return (
    <div className="page-content">
      <div className="welcome-row">
        <div>
          <span className="eyebrow">YOUR WORKSPACE</span>
          <h1>Good to see you, {
                    user?.name?.trim() ||
                    "Developer"} 👋</h1>
          <p className="muted">
            Here's what's happening in your developer workspace.
          </p>
        </div>
        <Link to="/projects" className="primary-button">
          + New project
        </Link>
      </div>

      <section className="stats-grid">
        {stats.map((stat) => (
          <article className="stat-card" key={stat.label}>
            <div className="stat-top">
              <span>{stat.label}</span>
              <span className="stat-icon">{stat.icon}</span>
            </div>
            <strong>{stat.value}</strong>
            <span className="stat-footnote">Workspace overview</span>
          </article>
        ))}
      </section>

      <div className="section-heading">
        <div>
          <h2>Your projects</h2>
          <p className="muted">Manage your work from one place.</p>
        </div>
        <Link className="text-link" to="/projects">View all →</Link>
      </div>

      {projects.length ? (
        <div className="project-grid">
          {projects.slice(0, 6).map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">▦</div>
          <h3>Your workspace starts here</h3>
          <p>Create your first project to organize notes, files and AI tools.</p>
          <Link to="/projects" className="primary-button">
            Create your first project
          </Link>
        </div>
      )}

      <section className="ai-banner">
        <div className="ai-banner-icon">✦</div>
        <div>
          <h3>Meet your AI development assistant</h3>
          <p>
            Get code explanations, improve your notes and draft project
            documentation.
          </p>
        </div>
        <Link to="/projects" className="secondary-button">Explore workspace</Link>
      </section>
    </div>
  );
}
