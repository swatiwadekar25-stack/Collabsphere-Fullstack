
import { useEffect, useState } from "react";
import FilePreview from "../components/FilePreview.jsx";

export default function Files() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.previewUrl) URL.revokeObjectURL(file.previewUrl);
      });
    };
  }, [files]);

  function handleFiles(event) {
    const selected = Array.from(event.target.files || []);
    const maxSize = 2 * 1024 * 1024;

    const valid = selected.filter((file) => file.size <= maxSize);

    if (valid.length !== selected.length) {
      setError("Files larger than 2 MB are skipped in this demo.");
    } else {
      setError("");
    }

    const newFiles = valid.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type,
      sizeLabel: `${(file.size / 1024).toFixed(1)} KB`,
      previewUrl:
        file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
    }));

    setFiles((previous) => [...previous, ...newFiles]);
    event.target.value = "";
  }

  function removeFile(id) {
    setFiles((previous) => {
      const removed = previous.find((file) => file.id === id);
      if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      return previous.filter((file) => file.id !== id);
    });
  }

  return (
    <div className="page-content">
      <div className="welcome-row">
        <div>
          <span className="eyebrow">PROJECT RESOURCES</span>
          <h1>Files & Code</h1>
          <p className="muted">Select local files to preview them in this demo.</p>
        </div>
        <label className="primary-button upload-button">
          + Select files
          <input
            type="file"
            multiple
            onChange={handleFiles}
            accept=".js,.jsx,.ts,.tsx,.py,.html,.css,.json,.md,.txt,image/*"
          />
        </label>
      </div>

      <div className="alert alert-info">
        Demo mode: selected files remain in the browser only. They are not
        shared with teammates or stored in MongoDB.
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {files.length ? (
        <div className="file-grid">
          {files.map((file) => (
            <FilePreview key={file.id} file={file} onRemove={removeFile} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">⌘</div>
          <h3>No files selected</h3>
          <p>Select an image or a small project file to see it here.</p>
        </div>
      )}
    </div>
  );
}
