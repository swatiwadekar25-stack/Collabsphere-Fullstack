
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import MarkdownEditor from "../components/MarkdownEditor.jsx";

export default function ProjectDetails({ projects }) {
  const { id } = useParams();
  const project = projects.find((item) => item.id === id);
  const [aiMode, setAiMode] = useState("explain");
  const [aiInput, setAiInput] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [aiMessage, setAiMessage] = useState("");

  if (!project) {
    return (
      <div className="page-content">
        <div className="empty-state">
          <h2>Project not found</h2>
          <p>This project may have been deleted or is unavailable.</p>
          <Link to="/projects" className="primary-button">
            Back to projects
          </Link>
        </div>
      </div>
    );
  }

  function handleAI(event) {
    event.preventDefault();

    if (!aiInput.trim()) {
      setAiMessage("Enter some text or code first.");
      return;
    }

    setAiMessage(
      "The Gemini API is not connected yet. We'll connect it through the backend in a later step."
    );
    setAiResult("");
  }

  return (
    <div className="page-content">
      <Link to="/projects" className="back-link">← Back to projects</Link>

      <div className="project-detail-header">
        <div className={`project-icon project-color-${project.color || 1}`}>
          {project.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <span className="eyebrow">PROJECT WORKSPACE</span>
          <h1>{project.name}</h1>
          <p className="muted">{project.description}</p>
        </div>
      </div>

      <div className="tag-list detail-tags">
        {project.technologies.map((technology) => (
          <span className="tag" key={technology}>{technology}</span>
        ))}
      </div>

      <div className="detail-layout">
        <div className="detail-main">
          <MarkdownEditor
            initialValue={`# ${project.name}\n\n## Overview\n${project.description}\n\n## Tasks\n- [ ] Plan the project\n- [ ] Implement the main features\n- [ ] Test the application\n`}
            onSave={() => {}}
          />

          <section className="panel">
            <div className="editor-heading">
              <div>
                <h2>Project resources</h2>
                <p className="muted">Keep your notes, files and AI tools together.</p>
              </div>
            </div>
            <div className="resource-links">
              <Link to="/notes">▤ Markdown Notes →</Link>
              <Link to="/files">⌘ Files & Code →</Link>
            </div>
          </section>
        </div>

        <aside className="panel ai-panel">
          <div className="ai-panel-heading">
            <span className="ai-banner-icon">✦</span>
            <div>
              <h2>Gemini AI</h2>
              <p className="muted">Your coding assistant</p>
            </div>
          </div>

          <label htmlFor="ai-mode">What do you need?</label>
          <select
            id="ai-mode"
            value={aiMode}
            onChange={(event) => setAiMode(event.target.value)}
          >
            <option value="explain">Explain code or notes</option>
            <option value="improve">Suggest improvements</option>
            <option value="docs">Generate documentation</option>
            <option value="readme">Generate README</option>
          </select>

          <label htmlFor="ai-input">Paste your text or code</label>
          <textarea
            id="ai-input"
            value={aiInput}
            onChange={(event) => setAiInput(event.target.value)}
            rows={8}
            placeholder="Paste code or describe your project..."
          />

          <button className="primary-button full-width" onClick={handleAI}>
            ✦ Prepare AI request
          </button>

          {aiMessage && <div className="alert alert-info">{aiMessage}</div>}
          {aiResult && <pre className="markdown-preview">{aiResult}</pre>}

          <p className="demo-notice">
            AI responses become available after backend integration.
          </p>
        </aside>
      </div>
    </div>
  );
}
