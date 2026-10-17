
import { useState } from "react";

const starterText = `# Project Notes

## Objective
Describe what this project should accomplish.

## Tasks
- [ ] Plan the feature
- [ ] Implement the feature
- [ ] Test the feature

## Ideas
Write your ideas here.
`;

export default function MarkdownEditor({ initialValue, onSave }) {
  const [content, setContent] = useState(initialValue ?? starterText);
  const [preview, setPreview] = useState(false);
  const [title, setTitle] = useState("Project Notes");
  const [message, setMessage] = useState("");

  function handleSave() {
    onSave?.({ title, content });
    setMessage("Saved in this demo session.");
  }

  return (
    <section className="panel markdown-panel">
      <div className="editor-heading">
        <div>
          <h2>Markdown editor</h2>
          <p className="muted">Write project documentation and notes.</p>
        </div>
        <button
          className="secondary-button"
          onClick={() => setPreview((value) => !value)}
        >
          {preview ? "Edit" : "Preview"}
        </button>
      </div>

      <label htmlFor="note-title">Note title</label>
      <input
        id="note-title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        maxLength={150}
      />

      <div className="editor-toolbar">
        <span>Markdown</span>
        <span>{content.length} characters</span>
      </div>

      {preview ? (
        <pre className="markdown-preview">{content}</pre>
      ) : (
        <textarea
          className="markdown-input"
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
            setMessage("");
          }}
          rows={14}
          placeholder="Write your Markdown here..."
        />
      )}

      <div className="editor-footer">
        <span className="muted">{message || "Markdown source editor"}</span>
        <button className="primary-button" onClick={handleSave}>
          Save note
        </button>
      </div>
    </section>
  );
}
