interface ThinkingIndicatorProps {
  status: string;
  progress: number;
}

export default function ThinkingIndicator({ status, progress }: ThinkingIndicatorProps) {
  return (
    <div className="thinking-indicator">
      <div className="thinking-content">
        <span className="codicon codicon-loading codicon-modifier-spin"></span>
        <span className="thinking-text">{status}</span>
      </div>
      {progress > 0 && (
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
