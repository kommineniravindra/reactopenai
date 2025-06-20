import React from 'react';

function ChatMessage({ message }) {
  const { text, role } = message;

  const isCode = text.includes('\n') || text.includes('```');
  const cleaned = text.replace(/^```[\w]*\n?/, '').replace(/```$/, '');

  return (
    <div className={`chat-message ${role === 'user' ? 'user' : 'ai'}`}>
      <img
        src={role === 'user' ? '/user.png' : '/ai.png'}
        alt={role}
        className="chat-avatar"
      />
      <div className="chat-bubble">
        {isCode ? (
          <pre>
            <code>{cleaned}</code>
          </pre>
        ) : (
          text
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
