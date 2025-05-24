import React from 'react';
import './FeaturesPage.css'; // Import the CSS file

const featuresData = [
  {
    name: 'Intelligent Conversations',
    description: 'Engage in natural and insightful conversations. ChatAI understands context and provides relevant responses.',
    icon: '💬',
  },
  {
    name: 'Coding Assistance',
    description: 'Get help with code snippets, debugging, and understanding complex programming concepts across various languages.',
    icon: '💻',
  },
  {
    name: 'Learning Partner',
    description: 'Ask questions, explore new topics, and get explanations on a wide range of subjects. Your personal tutor.',
    icon: '📚',
  },
  {
    name: 'Content Generation',
    description: 'Assists in drafting emails, writing articles, summarizing text, and other content creation tasks.',
    icon: '✍️',
  },
  {
    name: 'Contextual Actions',
    description: 'Select text within the chat to perform quick actions like "Fix with AI" or "Explain this".',
    icon: '⚙️',
  },
  {
    name: 'Always Improving',
    description: 'Powered by advanced AI models, ChatAI is constantly learning and evolving to serve you better.',
    icon: '🚀',
  },
  {
    name: 'Text Summarization',
    description: 'Condense long texts or documents into concise summaries.',
    icon: '¶', 
  },
  {
    name: 'Creative Brainstorming',
    description: 'Generate ideas, explore creative writing prompts, and solve problems.',
    icon: '💡',
  },
];

function FeaturesPage() {
  return (
    <div className="page-content features-page">
      <h2 className="features-title">ChatAI Features</h2>
      <div className="features-grid">
        {featuresData.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon-container">
              <span className="feature-icon">{feature.icon}</span>
            </div>
            <h3 className="feature-name">{feature.name}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeaturesPage;
