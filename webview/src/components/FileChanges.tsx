import { useState } from 'react';
import { FileChange } from '../types';
import { vscode } from '../vscode';

interface FileChangesProps {
  changes: FileChange[];
  changeId?: string;
}

export default function FileChanges({ changes, changeId }: FileChangesProps) {
  const [expanded, setExpanded] = useState(true);

  const handleOpenFile = (file: string) => {
    vscode.postMessage({ type: 'openFile', file });
  };

  const handleViewDiff = (file: string) => {
    if (changeId) {
      vscode.postMessage({ type: 'viewDiff', changeId, file });
    }
  };

  const totalAdded = changes.reduce((sum, c) => sum + c.linesAdded, 0);
  const totalRemoved = changes.reduce((sum, c) => sum + c.linesRemoved, 0);

  return (
    <div className="file-changes">
      <div 
        className="changes-header"
        onClick={() => setExpanded(!expanded)}
      >
        <span className={`codicon codicon-chevron-${expanded ? 'down' : 'right'}`}></span>
        <span className="codicon codicon-files"></span>
        <span>Changes ({changes.length} files)</span>
        <span className="changes-summary">
          <span className="added">+{totalAdded}</span>
          <span className="removed">-{totalRemoved}</span>
        </span>
      </div>

      {expanded && (
        <div className="changes-list">
          {changes.map((change, index) => (
            <div key={index} className="file-change-item">
              <div className="file-change-header">
                <span className={`codicon ${change.isNewFile ? 'codicon-new-file' : 'codicon-file'}`}></span>
                <span 
                  className="file-name"
                  onClick={() => handleOpenFile(change.file)}
                  title="Open file"
                >
                  {change.file}
                </span>
                <span className="file-stats">
                  <span className="added">+{change.linesAdded}</span>
                  <span className="removed">-{change.linesRemoved}</span>
                </span>
              </div>
              <div className="file-summary">{change.summary}</div>
              {changeId && (
                <div className="file-actions">
                  <button 
                    className="secondary-button"
                    onClick={() => handleViewDiff(change.file)}
                  >
                    <span className="codicon codicon-diff"></span>
                    View Diff
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
