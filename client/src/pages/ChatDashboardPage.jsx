import React from 'react';
import MainChatPanel from '../components/MainChatPanel';
import SideChatbox from '../components/SideChatbox';

function ChatDashboardPage() {
  return (
    <div className="chat-dashboard-page">
      <SideChatbox />
      <MainChatPanel />
    </div>
  );
}

export default ChatDashboardPage;
