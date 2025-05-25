import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ChatAIButton from './ChatAIButton';
import SuggestionMiniScreen from './SuggestionMiniScreen';
import '../App.css'; // Assuming App.css contains general styles

const MainChatPanel = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, selectedText: '' });
  const textAreaRef = useRef(null);
  const chatEndRef = useRef(null);
  const [isMiniScreenOpen, setIsMiniScreenOpen] = useState(false);

  useEffect(() => {
    // Auto-resize textarea
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [message]);

  useEffect(() => {
    // Scroll to bottom of chat
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    setError(null); // Clear error when user types
  };

  const formatTimestamp = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSend = async () => {
    if (message.trim() === '' && !isLoading) return;

    const newMessage = {
      id: Date.now(), // Unique ID for the message
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };
    setChatHistory(prevHistory => [...prevHistory, newMessage]);
    setMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', { // MODIFIED LINE: Use relative path
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: newMessage.text, history: chatHistory.slice(-10) }), // Send only the text and recent history
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiMessage = {
        id: Date.now() + 1, // Unique ID for AI message
        text: data.reply,
        sender: 'ai',
        timestamp: new Date(),
      };
      setChatHistory(prevHistory => [...prevHistory, aiMessage]);
    } catch (err) {
      console.error("Failed to send message:", err);
      const errorMessage = {
        id: Date.now() + 1,
        text: `Error: ${err.message || 'Could not connect to the AI. Please try again.'}`, 
        sender: 'ai',
        type: 'error', // Differentiate error messages
        timestamp: new Date(),
      };
      setChatHistory(prevHistory => [...prevHistory, errorMessage]);
      setError(err.message || 'Could not connect to the AI. Please try again.');
    }
    setIsLoading(false);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      const menuHeight = 180; // Estimated height of the context menu
      const menuWidth = 200;  // Estimated width of the context menu
      const buffer = 10; // Buffer from window edges

      let xPosition = e.clientX;
      let yPosition = e.clientY;

      // Adjust X position: if too close to the right edge, shift left
      if (xPosition + menuWidth + buffer > window.innerWidth) {
        xPosition = window.innerWidth - menuWidth - buffer;
      }
      // Adjust X position: if too close to the left edge (e.g., if menuWidth is large), shift right
      if (xPosition < buffer) {
        xPosition = buffer;
      }

      // Adjust Y position: 
      // If click is in lower half of screen, try to position menu upwards from click
      if (e.clientY > window.innerHeight / 2) {
        yPosition = e.clientY - menuHeight;
        // If it still goes off-screen (top), position it just below the top edge
        if (yPosition < buffer) {
          yPosition = buffer;
        }
      } else {
        // Click is in upper half, position menu downwards from click
        yPosition = e.clientY;
        // If it goes off-screen (bottom), position it just above the bottom edge
        if (yPosition + menuHeight + buffer > window.innerHeight) {
          yPosition = window.innerHeight - menuHeight - buffer;
        }
      }

      setContextMenu({ visible: true, x: xPosition, y: yPosition, selectedText });
    }
  };

  const handleCloseContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, selectedText: '' });
  };

  const handleContextMenuAction = async (action) => {
    const { selectedText } = contextMenu;
    handleCloseContextMenu();
    if (!selectedText) return;

    let prompt = '';
    switch (action) {
      case 'Fix with AI':
        prompt = `Fix the following text or code snippet: "${selectedText}"`;
        break;
      case 'Summarize text':
        prompt = `Summarize the following text: "${selectedText}"`;
        break;
      case 'Suggest with AI':
        prompt = `Provide suggestions for the following: "${selectedText}"`;
        break;
      case 'Solve using AI':
        prompt = `Solve the following problem or implement the following task: "${selectedText}"`;
        break;
      case 'Explain with AI':
        prompt = `Explain the following: "${selectedText}"`;
        break;
      default:
        return;
    }

    // Add user's prompt to chat history
    const userPromptMessage = {
      id: Date.now(),
      text: prompt, // Show the constructed prompt
      sender: 'user',
      timestamp: new Date(),
    };
    setChatHistory(prevHistory => [...prevHistory, userPromptMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', { // MODIFIED LINE: Use relative path
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, history: chatHistory.slice(-10) }), // Pass history if needed by context actions
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiMessage = {
        id: Date.now() + 1,
        text: data.reply,
        sender: 'ai',
        timestamp: new Date(),
      };
      setChatHistory(prevHistory => [...prevHistory, aiMessage]);
    } catch (err) {
      console.error("AI action failed:", err);
      const errorMessage = {
        id: Date.now() + 1,
        text: `Error processing AI action: ${err.message || 'An error occurred.'}`, 
        sender: 'ai',
        type: 'error',
        timestamp: new Date(),
      };
      setChatHistory(prevHistory => [...prevHistory, errorMessage]);
      setError(err.message || 'An error occurred processing the AI action.');
    }
    setIsLoading(false);
  };

  const handleChatAIButtonClick = () => {
    // alert('ChatAI Button Clicked!'); // VISUAL DEBUG: REMOVED
    console.log("ChatAI button clicked, toggling mini-screen. Current state:", isMiniScreenOpen);
    setIsMiniScreenOpen(prev => !prev);
    // It's useful to log the state *after* setting it, but due to async nature of setState,
    // it's better to log in a useEffect or see the direct effect on the component rendering.
  };

  const handleMiniScreenClose = () => {
    setIsMiniScreenOpen(false);
  };

  const handleSuggestionClick = (suggestion) => {
    // Append suggestion to the current message or set it if message is empty
    setMessage(prevMessage => prevMessage ? `${prevMessage} ${suggestion}` : suggestion);
    setIsMiniScreenOpen(false);
    if (textAreaRef.current) {
        textAreaRef.current.focus();
    }
  };

  // DEBUG: Log state before render
  console.log("MainChatPanel rendering, isMiniScreenOpen:", isMiniScreenOpen);

  return (
    <div className="main-chat-panel" onClick={handleCloseContextMenu} onContextMenu={handleContextMenu}>
      <div className="chat-history">
        {chatHistory.map((msg) => (
          <div key={msg.id} className={`message-row ${msg.sender === 'user' ? 'user-row' : 'ai-row'} ${msg.type === 'error' ? 'error-row' : ''}`}>
            <div className={`chat-message ${msg.sender} ${msg.type === 'error' ? 'error-message' : ''}`}>
              {/* Sender Label INSIDE the bubble */}
              {msg.sender === 'user' && <div className="sender-label">You</div>}
              {msg.sender === 'ai' && <div className="sender-label">ChatAI</div>}
              
              {msg.type === 'error' ? (
                <p>{msg.text}</p>
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
              )}
              <span className="timestamp">{formatTimestamp(msg.timestamp)}</span>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
        {isLoading && 
          <div className="message-row ai-row">
            {/* No separate sender label for loading row, it's part of the message */}
            <div className="chat-message ai loading-indicator">
              <div className="sender-label">ChatAI</div> {/* Label inside loading bubble */}
              ChatAI is thinking...
            </div>
          </div>
        }
      </div>

      {contextMenu.visible && (
        <div
          className="context-menu"
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
        >
          <ul>
            <li onClick={() => handleContextMenuAction('Fix with AI')}>Fix with AI</li>
            <li onClick={() => handleContextMenuAction('Summarize text')}>Summarize text</li>
            <li onClick={() => handleContextMenuAction('Suggest with AI')}>Suggest with AI</li>
            <li onClick={() => handleContextMenuAction('Solve using AI')}>Solve using AI</li>
            <li onClick={() => handleContextMenuAction('Explain with AI')}>Explain with AI</li>
          </ul>
        </div>
      )}

      <div className="chat-input-container">
        <ChatAIButton onClick={handleChatAIButtonClick} />
        <SuggestionMiniScreen 
          isOpen={isMiniScreenOpen} 
          onClose={handleMiniScreenClose} 
          onSuggestionClick={handleSuggestionClick} 
          currentInput={message} // Pass current message as a prop
        />
        <textarea
          ref={textAreaRef}
          value={message}
          onChange={handleInputChange}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault(); // Prevent newline in textarea
              handleSend();
            }
          }}
          placeholder="Type your message or ask ChatAI..."
          rows="1"
        />
        <button onClick={handleSend} className="send-button" disabled={isLoading || message.trim() === ''}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path>
          </svg>
        </button>
      </div>
      {/* SuggestionMiniScreen was here, now moved inside chat-input-container */}
    </div>
  );
};

export default MainChatPanel;
