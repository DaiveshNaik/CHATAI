import React from 'react';

// Define featuresData directly in this component or import it
// For simplicity, defining it here. In a larger app, you might import it.
const featuresData = [
  { name: 'Intelligent Conversations' },
  { name: 'Coding Assistance' },
  { name: 'Learning Partner' },
  { name: 'Content Generation' },
  { name: 'Contextual Actions' },
  { name: 'Text Summarization' },
  { name: 'Creative Brainstorming' },
  // Add more features if they exist in FeaturesPage.jsx
];

function SideChatbox() {
  return (
    <aside className="side-chatbox">
      <h3>Quick Tools / Notes</h3>
      {/* <p>This is a placeholder for a secondary chatbox or utility panel.</p>
      <p>Future features could include:</p>
      <ul>
        <li>Quick commands</li>
        <li>Scratchpad</li>
        <li>Contextual help</li>
      </ul> */}

      <h4>ChatAI Features:</h4>
      <ul style={{ paddingLeft: '20px', fontSize: '0.9rem' }}>
        {featuresData.map((feature, index) => (
          <li key={index} style={{ marginBottom: '5px' }}>{feature.name}</li>
        ))}
      </ul>

      <p style={{ marginTop: 'auto', fontSize: '0.8rem', color: 'var(--secondary-text-color)' }}>
        Tip: Select text in the main chat to get quick actions.
      </p>
    </aside>
  );
}

export default SideChatbox;
