import React from 'react';

function InputBox({ prompt, setPrompt, handleSubmit, loading }) {
  // Submit when Enter is pressed
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // prevent new line
      handleSubmit();
    }
  };

  return (
    <div className="input-section">
      <span className="sparkle">✨</span>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Tell me how to turn on a light bulb with Wi-Fi"
      />
      <button onClick={handleSubmit} disabled={loading}>
        Generate →
      </button>
    </div>
  );
}

export default InputBox;
