import React, { useState, useEffect } from 'react';
import './SuggestionMiniScreen.css';

const defaultSuggestions = [
  "Help me write an email to...",
  "Explain this code:",
  "Suggest a subject line for:",
  "Brainstorm ideas for a blog post about...",
  "Translate this to French:",
  "What's the capital of Australia?",
  "Give me a recipe for pasta.",
  "Debug this JavaScript function:",
  "Write a Python script to...",
  "Summarize this article:"
];

const SuggestionMiniScreen = ({ isOpen, onClose, onSuggestionClick, currentInput }) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState(defaultSuggestions);

  useEffect(() => {
    if (!currentInput || currentInput.trim() === "") {
      setFilteredSuggestions(defaultSuggestions);
    } else {
      const lowerInput = currentInput.toLowerCase();
      const newFiltered = defaultSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(lowerInput)
      );
      if (newFiltered.length > 0) {
        setFilteredSuggestions(newFiltered);
      } else {
        setFilteredSuggestions([
          `Complete: "${currentInput}"`,
          ...defaultSuggestions.slice(0,2)
        ]);
      }
    }
  }, [currentInput]);


  if (!isOpen) {
    return null;
  }

  const handleInternalClose = () => {
    console.log("SuggestionMiniScreen: Close button clicked. Attempting to call onClose prop.");
    if (onClose) {
      onClose();
    } else {
      console.error("SuggestionMiniScreen: onClose prop is missing or not a function!");
    }
  };

  const handleInternalSuggestionClick = (suggestion) => {
    console.log(`SuggestionMiniScreen: Suggestion "${suggestion}" clicked. Attempting to call onSuggestionClick prop.`);
    if (onSuggestionClick) {
      if (suggestion.startsWith("Complete: \"")) {
        onSuggestionClick(currentInput);
      } else {
        onSuggestionClick(suggestion);
      }
    } else {
      console.error("SuggestionMiniScreen: onSuggestionClick prop is missing or not a function!");
    }
  };

  return (
    <div className="suggestion-mini-screen">
      <button className="close-mini-screen" onClick={handleInternalClose}>×</button>
      <h4>Quick Suggestions</h4>
      {filteredSuggestions.length > 0 ? (
        <ul>
          {filteredSuggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleInternalSuggestionClick(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      ) : (
        <p>No specific suggestions. Type to refine.</p> 
      )}
      <p>You can also type your query directly into the chat.</p>
    </div>
  );
};

export default SuggestionMiniScreen;
