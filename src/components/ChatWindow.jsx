import { useState, useEffect, useRef } from "react";
import { formatTimestamp } from "../helper";

function ChatWindow({ conversationData, onPostMessage, isLoading }) {
  const [messageBar, setMessageBar] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversationData]);

  const handleSendMessage = () => {
    if (messageBar.trim() === "") return;
    onPostMessage(messageBar.trim());
    setMessageBar("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-chat">
        <div className="chat-loading-overlay">
          <p>Loading Conversation...</p>
        </div>
      </div>
    );
  }

  if (!conversationData) {
    return <div className="dashboard-chat-loading">Select a conversation to start chatting...</div>;
  }

  return (
    <div className="dashboard-chat">
      <div className="dashboard-chat-main" ref={scrollRef}>
        {conversationData.messages.map((msg) => (
          <div className="chat-message" key={msg.id}>
            <div className="chat-avatar noselect">{msg.user.emoji || '👤'}</div>
            <div className="chat-content">
              <div className="chat-header">
                <span className="chat-username">{msg.user.username}</span>
                <time className="chat-timestamp" dateTime={msg.createdAt}>
                  {formatTimestamp(msg.createdAt)}
                </time>
              </div>
              <div className="chat-text">{msg.content}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="dashboard-chat-bar">
        <textarea
          className="chat-textarea"
          value={messageBar}
          onChange={(e) => setMessageBar(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatWindow;