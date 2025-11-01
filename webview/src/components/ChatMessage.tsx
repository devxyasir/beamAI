import { BeamMessage } from '../types';
import ThinkingIndicator from './ThinkingIndicator';
import PlanView from './PlanView';
import FileChanges from './FileChanges';
import CodeBlock from './CodeBlock';
import ConfidenceBar from './ConfidenceBar';
import ActionButtons from './ActionButtons';

interface ChatMessageProps {
  message: BeamMessage;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const timestamp = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  if (message.role === 'user') {
    return (
      <div className="message user-message">
        <div className="message-header">
          <span className="message-role">You</span>
          <span className="message-time">{timestamp}</span>
        </div>
        <div className="message-content">
          <div className="user-bubble">{message.content}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="message agent-message">
      <div className="message-header">
        <span className="codicon codicon-hubot"></span>
        <span className="message-role">Beam</span>
        <span className="message-time">{timestamp}</span>
        {message.appliedAt && (
          <span className="applied-badge">
            <span className="codicon codicon-check"></span> Applied
          </span>
        )}
      </div>
      <div className="message-content">
        {message.thinking && (
          <ThinkingIndicator
            status={message.thinking.status}
            progress={message.thinking.progress}
          />
        )}

        {message.plan && <PlanView plan={message.plan} />}

        {message.narrative && (
          <div className="narrative">
            <CodeBlock content={message.narrative} language="markdown" />
          </div>
        )}

        {message.changes && message.changes.length > 0 && (
          <FileChanges changes={message.changes} changeId={message.changeId} />
        )}

        {message.recommendations && message.recommendations.length > 0 && (
          <div className="recommendations">
            <div className="section-header">
              <span className="codicon codicon-lightbulb"></span>
              <span>Recommendations</span>
            </div>
            <ul>
              {message.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        )}

        {message.confidence !== undefined && (
          <ConfidenceBar value={message.confidence} />
        )}

        {message.status === 'completed' && message.changeId && !message.appliedAt && (
          <ActionButtons changeId={message.changeId} />
        )}

        {message.status === 'failed' && (
          <div className="error-message">
            <span className="codicon codicon-error"></span>
            <span>Task failed. Please try again or refine your request.</span>
          </div>
        )}
      </div>
    </div>
  );
}
