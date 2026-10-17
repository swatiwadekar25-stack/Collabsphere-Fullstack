
export default function FilePreview({ file, onRemove }) {
  return (
    <article className="file-card">
      <div className="file-icon">
        {file.type?.startsWith("image/") ? "▧" : "</>"}
      </div>
      <div className="file-info">
        <strong>{file.name}</strong>
        <span>{file.sizeLabel || "Demo file"}</span>
        {file.previewUrl && file.type?.startsWith("image/") && (
          <img
            className="file-thumbnail"
            src={file.previewUrl}
            alt={`Preview of ${file.name}`}
          />
        )}
      </div>
      {onRemove && (
        <button
          className="icon-button"
          onClick={() => onRemove(file.id)}
          aria-label={`Remove ${file.name}`}
        >
          ×
        </button>
      )}
    </article>
  );
}
