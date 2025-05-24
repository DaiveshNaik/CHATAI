import React from 'react';
// import { useNavigate } from 'react-router-dom'; // No longer navigating
import './ChatAIButton.css';

// Lightbulb Icon for suggestions/help
const SuggestionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20px" height="20px">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm0 16.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zm2-2H10v-1h4v1zm0-2H10v-1h4v1zm-.5-3.5c-.83 0-1.5-.67-1.5-1.5S10.67 8 11.5 8s1.5.67 1.5 1.5S12.33 10 11.5 10z"/>
    </svg>
);

function ChatAIButton({ onClick }) { // Accept onClick as a prop
    // const navigate = useNavigate(); // Removed

    return (
        <button className="chatai-input-action-button" onClick={onClick} title="Get suggestions from ChatAI">
            <SuggestionIcon />
        </button>
    );
}

export default ChatAIButton;
