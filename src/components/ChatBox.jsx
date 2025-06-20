import { useState } from 'react';
import './ChatBox.css';
import ChatMessage from './ChatMessage';
import InputBox from './InputBox';

function ChatBox() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typingText, setTypingText] = useState('');

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    const userMessage = { text: prompt, role: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt('');
    setLoading(true);
    setTypingText('');

    try {
      const response = await fetch(
        `http://localhost:8080/bot/chat?prompt=${encodeURIComponent(prompt)}`,
        { method: 'POST' }
      );
      const text = await response.text();
      typeAIResponse(text);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { text: '⚠️ Unable to connect.', role: 'ai' },
      ]);
      setLoading(false);
    }
  };

  const typeAIResponse = (text) => {
    let index = 0;
    const interval = setInterval(() => {
      setTypingText((prev) => prev + text.charAt(index));
      index++;
      if (index === text.length) {
        clearInterval(interval);
        setMessages((prev) => [...prev, { text, role: 'ai' }]);
        setTypingText('');
        setLoading(false);
      }
    }, 20);
  };

  return (
    <div className="hero-section">
      <header className="header">
        <div className="logo">OpenAI</div>
        <nav>
          <ul>
            <li>Overview</li>
            <li>Features</li>
            <li>FAQs</li>
            <li>About</li>
          </ul>
        </nav>
      </header>

      <main className="hero-content">
        <h1>Your intelligent assistant<br />for smarter solutions.</h1>
        <p>Free to use. Easy to try. Just ask and our AI assistant can help with writing, learning, brainstorming, and more.</p>

        <div className="chat-preview">
          {messages.map((msg, idx) => (
            <ChatMessage key={idx} message={msg} />
          ))}

          {loading && (
            <div className="chat-message ai">
              <img src="/AI.jpg" alt="AI" className="chat-avatar" />
              <div className="chat-bubble">
                {typingText}
                <span className="blinking-cursor">|</span>
              </div>
            </div>
          )}
        </div>

        <InputBox
          prompt={prompt}
          setPrompt={setPrompt}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      </main>

      <p className="attribution"></p>
    </div>
  );
}

export default ChatBox;
