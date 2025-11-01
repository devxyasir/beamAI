interface ConfidenceBarProps {
  value: number; // 0 to 1
}

export default function ConfidenceBar({ value }: ConfidenceBarProps) {
  const percentage = Math.round(value * 100);

  const getColor = () => {
    if (value >= 0.8) return 'var(--vscode-testing-iconPassed)';
    if (value >= 0.6) return 'var(--vscode-editorWarning-foreground)';
    return 'var(--vscode-editorError-foreground)';
  };

  return (
    <div className="confidence-bar">
      <div className="confidence-header">
        <span>Confidence</span>
        <span className="confidence-value">{percentage}%</span>
      </div>
      <div className="confidence-bar-track">
        <div
          className="confidence-bar-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: getColor()
          }}
        />
      </div>
    </div>
  );
}
