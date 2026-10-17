
import { useState } from "react";
import ProjectCard from "../components/ProjectCard.jsx";

export default function Projects({ projects, onCreate, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("React, Node.js, MongoDB");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim() || !description.trim()) {
      setError("Project name and description are required.");
      return;
    }

    onCreate({
      name: name.trim(),
      description: description.trim(),
      technologies: technologies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    });

    setName("");
    setDescription("");
    setTechnologies("");
    setError("");
    setShowForm(false);
  }

  return (
    <div className="page-content">
      <div className="welcome-row">
        <div>
          <span className="eyebrow">WORKSPACE</span>
          <h1>My Projects</h1>
          <p className="muted">Create and organize your development projects.</p>
        </div>
        <button
          className="primary-button"
          onClick={() => setShowForm((visible) => !visible)}
        >
          {showForm ? "Cancel" : "+ Create project"}
        </button>
      </div>

      {showForm && (
        <form className="panel project-form" onSubmit={handleSubmit}>
          <h2>Create a new project</h2>

          {error && <div className="alert alert-error">{error}</div>}

          <label htmlFor="project-name">Project name</label>
          <input
            id="project-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Student Management System"
            maxLength={100}
            required
          />

          <label htmlFor="project-description">Description</label>
          <textarea
            id="project-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What are you building and why?"
            rows={3}
            maxLength={1000}
            required
          />

          <label htmlFor="project-technologies">Technologies</label>
          <input
            id="project-technologies"
            value={technologies}
            onChange={(event) => setTechnologies(event.target.value)}
            placeholder="React, Express, MongoDB"
          />

          <button className="primary-button" type="submit">
            Create project
          </button>
        </form>
      )}

      {projects.length ? (
        <div className="project-grid">
          {projects.map((project) => (
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
          <h3>No projects yet</h3>
          <p>Create a project to start organizing your work.</p>
          <button
            className="primary-button"
            onClick={() => setShowForm(true)}
          >
            + Create project
          </button>
        </div>
      )}
    </div>
  );
}
