import { useState, useEffect } from 'react';
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

  // ✅ FIXED: Proper typing animation with first character shown
 const typeAIResponse = (fullText) => {
  let i = 0;
  let current = '';

  const typeChar = () => {
    if (i < fullText.length) {
      current += fullText[i];
      setTypingText(current);
      i++;

      // Scroll to bottom during typing
      const preview = document.querySelector('.chat-preview');
      preview?.scrollTo({ top: preview.scrollHeight, behavior: 'smooth' });

      setTimeout(typeChar, 20);
    } else {
      setMessages((prev) => [...prev, { text: fullText, role: 'ai' }]);
      setTypingText('');
      setLoading(false);
        // ✅ Final scroll after complete message
      const preview = document.querySelector('.chat-preview');
      preview?.scrollTo({ top: preview.scrollHeight, behavior: 'smooth' });
    }
  };

  typeChar();
};




  useEffect(() => {
    const chatPreview = document.querySelector('.chat-preview');
    chatPreview?.scrollTo(0, chatPreview.scrollHeight);
  }, [typingText, messages]);

  return (
    <div className="hero-section">
    

      <main className="hero-content">
        <h2>Your intelligent assistant<br />for smarter solutions.</h2>
        <p>Smarter answers. Instantly delivered by your AI assistant.</p>
       
        <div className="chat-preview">
          {messages.map((msg, idx) => (
            <ChatMessage key={idx} message={msg} />
          ))}

          {loading && (
            <div className="chat-message ai">
              <img src="/ai.png" alt="AI" className="chat-avatar" />
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

      <p className="attribution">Made with 💡 using React</p>
    </div>
  );
}

export default ChatBox;
