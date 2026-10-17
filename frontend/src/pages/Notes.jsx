
import { useState } from "react";
import MarkdownEditor from "../components/MarkdownEditor.jsx";

export default function Notes() {
  const [savedNotes, setSavedNotes] = useState([]);

  function saveNote(note) {
    setSavedNotes((previous) => [
      { ...note, id: crypto.randomUUID() },
      ...previous,
    ]);
  }

  return (
    <div className="page-content">
      <div className="welcome-row">
        <div>
          <span className="eyebrow">DOCUMENTATION</span>
          <h1>Markdown Notes</h1>
          <p className="muted">Write down ideas, decisions and project plans.</p>
        </div>
        <span className="tag">{savedNotes.length} demo notes saved</span>
      </div>

      <MarkdownEditor onSave={saveNote} />

      {savedNotes.length > 0 && (
        <section className="panel saved-notes">
          <h2>Saved in this session</h2>
          {savedNotes.map((note) => (
            <article className="saved-note-row" key={note.id}>
              <div>
                <strong>{note.title || "Untitled note"}</strong>
                <p className="muted">{note.content.slice(0, 100)}</p>
              </div>
              <span className="tag">Demo</span>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
