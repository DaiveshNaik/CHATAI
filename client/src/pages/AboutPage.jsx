import React from 'react';
// Styles are now global via App.css

function AboutPage() {
  return (
    <div className="page-content about-page">
      <h2>About ChatAI</h2>
      <p>
        <strong>ChatAI</strong> is your advanced AI-powered assistant, designed to be a versatile partner for coding, learning, content creation, and more.
        We aim to provide a seamless and intuitive chat experience, leveraging the power of cutting-edge language models to deliver intelligent and helpful responses.
      </p>
      <p>
        Whether you're a developer looking for quick code solutions, a student seeking explanations for complex topics, or a professional needing assistance with drafting content,
        ChatAI is here to help you achieve your goals more efficiently.
      </p>
      <p>
        Our mission is to make advanced AI accessible and useful for everyone. ChatAI is continuously learning and evolving, and we are committed to enhancing its capabilities
        to better serve your needs.
      </p>
      <p>
        This application is built using modern web technologies including React for the frontend and Node.js for the backend, powered by Gemini's generative AI models.
      </p>
      <p>
        Thank you for using ChatAI!
      </p>
    </div>
  );
}

export default AboutPage;
