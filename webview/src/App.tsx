import { useState, useEffect } from 'react';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import { useVSCodeMessage } from './hooks/useVSCodeMessage';
import { BeamMessage } from './types';

function App() {
  const [messages, setMessages] = useState<BeamMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useVSCodeMessage((message) => {
    switch (message.type) {
      case 'userMessage':
        setMessages(prev => [...prev, message.data]);
        setIsProcessing(true);
        break;

      case 'agentThinking':
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'agent',
          content: '',
          timestamp: new Date().toISOString(),
          thinking: message.data,
          status: 'thinking'
        }]);
        break;

      case 'agentProgress':
        setMessages(prev => {
          const newMessages = [...prev];
          const lastAgentMessage = newMessages.findIndex(
            m => m.role === 'agent' && m.status !== 'completed'
          );
          if (lastAgentMessage !== -1) {
            newMessages[lastAgentMessage] = {
              ...newMessages[lastAgentMessage],
              ...message.data,
              status: message.data.status || 'executing'
            };
          }
          return newMessages;
        });
        break;

      case 'agentResponse':
        setMessages(prev => {
          const newMessages = [...prev];
          const lastAgentMessage = newMessages.findIndex(
            m => m.role === 'agent' && m.status !== 'completed'
          );
          if (lastAgentMessage !== -1) {
            newMessages[lastAgentMessage] = message.data;
          } else {
            newMessages.push(message.data);
          }
          return newMessages;
        });
        setIsProcessing(false);
        break;

      case 'changesApplied':
        setMessages(prev => {
          const newMessages = [...prev];
          const messageIndex = newMessages.findIndex(
            m => m.changeId === message.data.changeId
          );
          if (messageIndex !== -1) {
            newMessages[messageIndex] = {
              ...newMessages[messageIndex],
              appliedAt: new Date().toISOString()
            };
          }
          return newMessages;
        });
        break;

      case 'error':
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'agent',
          content: `Error: ${message.data.message}`,
          timestamp: new Date().toISOString(),
          status: 'failed'
        }]);
        setIsProcessing(false);
        break;

      case 'clearChat':
        setMessages([]);
        break;

      case 'restoreHistory':
        setMessages(message.data);
        break;
    }
  });

  // Auto-scroll to bottom
  useEffect(() => {
    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="beam-chat">
      <div className="messages-container" id="messages-container">
        {messages.length === 0 && (
          <div className="empty-state">
            <span className="codicon codicon-comment-discussion"></span>
            <p>Ask Beam anything about your code</p>
            <div className="suggestions">
              <button className="suggestion" onClick={() => {}}>
                Explain this codebase
              </button>
              <button className="suggestion" onClick={() => {}}>
                Add authentication
              </button>
              <button className="suggestion" onClick={() => {}}>
                Refactor for performance
              </button>
            </div>
          </div>
        )}
        
        {messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>

      <ChatInput 
        onSend={(text) => {
          const userMessage: BeamMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: new Date().toISOString()
          };
          setMessages(prev => [...prev, userMessage]);
          setIsProcessing(true);
        }}
        disabled={isProcessing}
      />
    </div>
  );
}

export default App;
