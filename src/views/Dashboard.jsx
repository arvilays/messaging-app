import { useState, useEffect, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { formatTimestamp } from "../helper";
import "emoji-picker-element";
import echoLogo from "../assets/echo_logo.png";
import globalIcon from "../assets/web.svg";
import logoutIcon from "../assets/logout.svg";
import "../styles/dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);

  const [currentConversation, setCurrentConversation] = useState("global");
  const [conversationData, setConversationData] = useState(null);
  const [showAddConversation, setShowAddConversation] = useState(false);

  const [dmUsers, setDmUsers] = useState([""]);

  const [messageBar, setMessageBar] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const scrollRef = useRef(null);

  const { apiClient, token, setToken } = useOutletContext();
  const navigate = useNavigate();

  const handleUserChange = (index, value) => {
    const newUsers = [...dmUsers];
    newUsers[index] = value;
    setDmUsers(newUsers);
  }

  const handleAddConversationUser = () => setDmUsers([...dmUsers, ""]);

  const handleAddConversation = async () => {
    try {
      const response = await apiClient.request("/conversation", {
        method: "POST",
        data: { usernames: dmUsers },
        token: token,
      });
      console.log("Conversation created:", response);
      fetchUser();
      setDmUsers([""]);
    } catch (err) {
      console.error("Error creating conversation:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    setToken(null);
    navigate("/");
  }

  const fetchUser = async () => {
    try {
      const data = await apiClient.request("/user", { token });
      setUser(data);
    } catch (err) {
      if (err.message === "Unauthorized") navigate("/");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversation = async () => {
    try {
      const data = await apiClient.request(`/conversation/${currentConversation}`, { 
        token: token, 
      });
      setConversationData(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const postMessage = async (message) => {
    try {
      await apiClient.request(`/message`, {
        method: "POST",
        data: { conversationId: currentConversation, message: message },
        token: token,
      });

      fetchConversation();
      fetchUser();
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    if (!token) return;
    fetchUser();
  }, [apiClient, token]);

  // Redirect to login page if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  // Scroll chat window to bottom on load
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversationData]);

  // Reset DM user fields when showing/hiding add-conversation window
  useEffect(() => {
    setDmUsers([""]);
  }, [showAddConversation]);

  // Change main chat window to current conversation
  useEffect(() => {
    if (user && currentConversation) {
      fetchConversation();
      setMessageBar("");
    }
  }, [currentConversation, user]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <div className="dashboard-sidebar-header noselect">
          <img src={echoLogo} alt="echo" />
          <div className="dashboard-sidebar-header-title">echo</div>
        </div>
        
        <div className="conversation-global noselect">
          <div 
            className={`conversation-item ${currentConversation === "global" ? "selected" : ""}`}
            onClick={() => setCurrentConversation("global")}
          >
            <img className="conversation-icon-global" src={globalIcon} alt="global chat" />
            <div className="conversation-name">Global Chat</div>
          </div>
        </div>
        
        <hr />

        <div className="conversation-category noselect">
          <div className="conversation-category-title">Direct Messages</div>
          <div 
            className="conversation-category-add" 
            title="Add New DM"
            onClick={() => setShowAddConversation(!showAddConversation)}
          >
            {showAddConversation ? "—" : "+"}
          </div>
        </div>

        {showAddConversation && (
          <div className="conversation-category-add-users noselect">
            {dmUsers.map((user, i) => (
              <input 
                key={i} 
                type="text" 
                value={user}
                onChange={(e) => handleUserChange(i, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Tab" && !e.shiftKey && i === dmUsers.length - 1) {
                    handleAddConversationUser();
                  }
                }}
                placeholder="Username" 
              />
            ))}
            <div 
              className="add-user" onClick={handleAddConversationUser}>+</div>
            <div className="create-conversation" onClick={handleAddConversation}>Create Conversation</div>
          </div>
        )}

        <div className="conversation-category-list noselect">
          {user.conversations.map((conversation) => (
              <div 
                className={`conversation-item ${currentConversation === conversation.id ? "selected" : ""}`} 
                key={conversation.id} 
                title={conversation.title}
                onClick={() => setCurrentConversation(conversation.id)}
              >
                <div className="conversation-icon">
                  {(() => {
                    const others = conversation.users.filter(u => u.username !== user.username);
                    if (others.length === 1) {
                      return others[0].emoji;
                    } else if (others.length === 2) {
                      return (
                        <div className="emoji-stack">
                          <span className="emoji-back">{others[0].emoji}</span>
                          <span className="emoji-front">{others[1].emoji}</span>
                        </div>
                      );
                    } else if (others.length >= 3) {
                      const extraCount = others.length - 2;
                      return (
                        <div className="emoji-stack">
                          <span className="emoji-back">{others[0].emoji}</span>
                          <span className="emoji-front">{others[1].emoji}</span>
                          <span className="emoji-extra">+{extraCount}</span>
                        </div>
                      );
                    }
                    return "👤";
                  })()}
                </div>


                <div className="conversation-name">
                  {conversation.users
                    .filter(u => u.username !== user.username)
                    .map(u => u.username)
                    .sort()
                    .join(", ")}
                </div>
              </div>
          ))}
        </div> 

        <emoji-picker className="emoji-picker"></emoji-picker>

        <div className="dashboard-sidebar-profile">
          <div className="profile-avatar noselect">{user.emoji}</div>
          <div className="profile-name">{user.username}</div>
          <img 
            className="profile-settings noselect" 
            onClick={handleLogout} 
            src={logoutIcon} 
            alt="logout"
            title="Log Out"
          />
        </div>
      </div>

      <div className="dashboard-chat">
        { conversationData && (
          <div className="dashboard-chat-main" ref={scrollRef}>
            {conversationData.messages.map((msg) => (
              <div className="chat-message" key={msg.id}>
                <div className="chat-avatar">{msg.user.emoji}</div>
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
        )}

        <div className="dashboard-chat-bar">
          <textarea
            className="chat-textarea"
            value={messageBar}
            onChange={(e) => {
              setMessageBar(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (messageBar.trim() !== "") {
                  postMessage(messageBar);
                  setMessageBar("");
                  e.target.style.height = "auto";
                }
              }
            }}
            placeholder="Type a message..."
            rows={1}
          />
        </div>

      </div>

     
      <div className="dashboard-members">
        {conversationData && (
          <>
            <div className="dashboard-members-header">Members — {conversationData.users.length}</div>
            <div className="dashboard-members-list">
              {conversationData.users.map((user) => (
                <div className="dashboard-members-user" key={user.username}>
                  <div className="dashboard-members-avatar">{user.emoji}</div>
                  <div className="dashboard-members-username">{user.username}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;