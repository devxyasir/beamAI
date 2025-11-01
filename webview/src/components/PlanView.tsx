import { useState } from 'react';
import { ExecutionPlan } from '../types';

interface PlanViewProps {
  plan: ExecutionPlan;
}

export default function PlanView({ plan }: PlanViewProps) {
  const [expanded, setExpanded] = useState(true);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'codicon-check';
      case 'running':
        return 'codicon-loading codicon-modifier-spin';
      case 'failed':
        return 'codicon-error';
      default:
        return 'codicon-circle-outline';
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk >= 0.7) return 'var(--vscode-editorError-foreground)';
    if (risk >= 0.4) return 'var(--vscode-editorWarning-foreground)';
    return 'var(--vscode-editorInfo-foreground)';
  };

  return (
    <div className="plan-view">
      <div 
        className="plan-header" 
        onClick={() => setExpanded(!expanded)}
      >
        <span className={`codicon codicon-chevron-${expanded ? 'down' : 'right'}`}></span>
        <span className="codicon codicon-checklist"></span>
        <span>Execution Plan</span>
        <span 
          className="risk-badge" 
          style={{ color: getRiskColor(plan.riskLevel) }}
        >
          Risk: {Math.round(plan.riskLevel * 100)}%
        </span>
      </div>

      {expanded && (
        <div className="plan-content">
          <div className="plan-impact">{plan.estimatedImpact}</div>
          <div className="subtasks">
            {plan.subtasks.map((subtask) => (
              <div key={subtask.id} className="subtask">
                <span className={`codicon ${getStatusIcon(subtask.status)}`}></span>
                <span className="subtask-title">{subtask.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
