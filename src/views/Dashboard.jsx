import { useEffect, useRef, useMemo } from "react";
import echoLogo from "../assets/echo_logo.png";
import globalIcon from "../assets/web.svg";
import settingsIcon from "../assets/cog.svg";
import "../styles/dashboard.css";

function Dashboard() {
  const scrollRef = useRef(null);

  const messages = useMemo(() => [
    {
      id: 1,
      username: "John",
      timestamp: "2025-07-17T08:40",
      displayTime: "7/17/2025 8:40 AM",
      text: "how's everyone doing?? :)",
      avatar: globalIcon,
    },
    {
      id: 2,
      username: "Alice",
      timestamp: "2025-07-17T08:40",
      displayTime: "7/17/2025 8:45 AM",
      text: "good morning!!",
      avatar: globalIcon,
    },
    {
      id: 3,
      username: "Bob",
      timestamp: "2025-07-17T08:40",
      displayTime: "7/17/2025 8:46 AM",
      text: "hellooooo",
      avatar: globalIcon,
    },
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <div className="dashboard-sidebar-header">
          <img src={echoLogo} alt="echo" />
          <div className="dashboard-sidebar-header-title">echo</div>
        </div>
        
        <div className="conversation-global">
          <div className="conversation-item">
            <img className="conversation-icon" src={globalIcon} alt="global chat" />
            <div className="conversation-name">Global Chat</div>
          </div>
        </div>
        
        <hr />

        <div className="conversation-category">
          <div className="conversation-category-title">Direct Messages</div>
          <div className="conversation-category-add">+</div>
        </div>

        <div className="conversation-category-list">
          {/* API here */}
          <div className="conversation-item">
            <img className="conversation-icon" src={globalIcon} alt="global chat" />
            <div className="conversation-name">John</div>
          </div>

          <div className="conversation-item">
            <img className="conversation-icon" src={globalIcon} alt="global chat" />
            <div className="conversation-name">Alice</div>
          </div>

          <div className="conversation-item">
            <img className="conversation-icon" src={globalIcon} alt="global chat" />
            <div className="conversation-name">Bob</div>
          </div>
        </div>

        <div className="dashboard-sidebar-profile">
          <img className="profile-avatar" src={globalIcon} alt="avatar" />
          <div className="profile-name">Charlie</div>
          <img className="profile-settings" src={settingsIcon} alt="profile settings" />
        </div>
      </div>

      <div className="dashboard-chat">
        <div className="dashboard-chat-main" ref={scrollRef}>
          {messages.map((msg) => (
            <div className="chat-message" key={msg.id}>
              <img className="chat-avatar" src={msg.avatar} alt="avatar" />
              <div className="chat-content">
                <div className="chat-header">
                  <span className="chat-username">{msg.username}</span>
                  <time className="chat-timestamp" dateTime={msg.timestamp}>
                    {msg.displayTime}
                  </time>
                </div>
                <div className="chat-text">{msg.text}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="dashboard-chat-bar">
          <input type="text" />
        </div>
      </div>

      <div className="dashboard-members">
        <div className="dashboard-members-header">Members — 3</div>
        <div className="dashboard-members-list">
          <div className="dashboard-members-user">
            <img className="dashboard-members-avatar" src={globalIcon} alt="avatar" />
            <div className="dashboard-members-username">John</div>
          </div>

          <div className="dashboard-members-user">
            <img className="dashboard-members-avatar" src={globalIcon} alt="avatar" />
            <div className="dashboard-members-username">Alice</div>
          </div>

          <div className="dashboard-members-user">
            <img className="dashboard-members-avatar" src={globalIcon} alt="avatar" />
            <div className="dashboard-members-username">Bob</div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default Dashboard;