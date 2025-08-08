import { useState, useEffect, useCallback, useRef } from "react";
import "emoji-picker-element";
import echoLogo from "../assets/echo_logo.png";
import globalIcon from "../assets/web.svg";
import logoutIcon from "../assets/logout.svg";

function Sidebar({ user, currentConversationId, onConversationSelect, onLogout, onConversationCreated, onConversationUpdate, apiClient }) {
  const [showAddConversation, setShowAddConversation] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [dmUsers, setDmUsers] = useState([""]);

  const emojiPickerRef = useRef(null);
  const avatarRef = useRef(null);
  const addUserInputsRef = useRef([]);

  const updateUserAvatar = useCallback(async (emoji) => {
    try {
      await apiClient.request(`/user-avatar`, { method: "POST", data: { emoji } });
      onConversationUpdate();
    } catch (err) {
      alert("Error updating avatar: " + err.message);
    }
  }, [apiClient, onConversationUpdate]);

  const handleUserChange = (index, value) => {
    const newUsers = [...dmUsers];
    newUsers[index] = value;
    setDmUsers(newUsers);
  };

  const handleAddConversationUser = () => setDmUsers([...dmUsers, ""]);

  const handleCreateConversation = async () => {
    try {
      const newConversation = await apiClient.request("/conversation", {
        method: "POST",
        data: { usernames: dmUsers.filter(u => u) },
      });

      if (newConversation && newConversation.conversationId) {
        onConversationCreated(newConversation.conversationId);
      }

      setDmUsers([""]);
      setShowAddConversation(false);
    } catch (err) {
      alert("Error creating conversation: " + err.message);
    }
  };

  // Handles closing the emoji picker when the user clicks outside of it
  useEffect(() => {
    const handleClick = (event) => {
      if (avatarRef.current && avatarRef.current.contains(event.target)) {
        return;
      }

      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [showEmojiPicker]); 

  // Attaches an event listener to the emoji picker web component
  useEffect(() => {
    const picker = emojiPickerRef.current;
    if (!picker || !showEmojiPicker) return;

    const handleEmojiClick = (e) => {
      updateUserAvatar(e.detail.unicode);
      setShowEmojiPicker(false);
    };

    picker.addEventListener("emoji-click", handleEmojiClick);
    return () => picker.removeEventListener("emoji-click", handleEmojiClick);
  }, [showEmojiPicker, updateUserAvatar]);

  // Auto-focuses the last input field in the "Add DM" form
  useEffect(() => {
    if (showAddConversation) {
      const lastInput = addUserInputsRef.current[addUserInputsRef.current.length - 1];
      if (lastInput) lastInput.focus();
    }
  }, [dmUsers.length, showAddConversation]);

  // Resets the "Add DM" form whenever it is opened or closed
  useEffect(() => {
    setDmUsers([""]);
  }, [showAddConversation]);

  return (
    <div className="dashboard-sidebar">
      <div className="dashboard-sidebar-header noselect">
        <img src={echoLogo} alt="echo" />
        <div className="dashboard-sidebar-header-title">echo</div>
      </div>

      <div className="conversation-global noselect">
        <div
          className={`conversation-item ${currentConversationId === "global" ? "selected" : ""}`}
          onClick={() => onConversationSelect("global")}
        >
          <img className="conversation-icon-global" src={globalIcon} alt="global chat" />
          <div className="conversation-name">Global Chat</div>
        </div>
      </div>

      <hr />

      <div className="conversation-category noselect">
        <div className="conversation-category-title">Direct Messages</div>
        <div className="conversation-category-add" title="Add New DM" onClick={() => setShowAddConversation(!showAddConversation)}>
          {showAddConversation ? "—" : "+"}
        </div>
      </div>

      {showAddConversation && (
        <div className="conversation-category-add-users noselect">
          {dmUsers.map((user, i) => (
            <input
              key={i}
              ref={el => addUserInputsRef.current[i] = el}
              type="text"
              value={user}
              onChange={(e) => handleUserChange(i, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Tab" && !e.shiftKey && i === dmUsers.length - 1) {
                  e.preventDefault();
                  handleAddConversationUser();
                }
              }}
              placeholder="Username"
            />
          ))}
          <button className="add-user" onClick={handleAddConversationUser}>+</button>
          <button className="create-conversation" onClick={handleCreateConversation}>Create Conversation</button>
        </div>
      )}

      <div className="conversation-category-list noselect">
        {user.conversations.map((convo) => (
          <div
            className={`conversation-item ${currentConversationId === convo.id ? "selected" : ""}`}
            key={convo.id}
            title={convo.users.filter(u => u.username !== user.username).map(u => u.username).join(', ')}
            onClick={() => onConversationSelect(convo.id)}
          >
            <div className="conversation-icon">
              {(() => {
                const others = convo.users.filter(u => u.username !== user.username);
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
              {convo.users
                .filter(u => u.username !== user.username)
                .map(u => u.username)
                .sort()
                .join(", ")}
            </div>
          </div>
        ))}
      </div>

      {showEmojiPicker && <emoji-picker ref={emojiPickerRef} className="emoji-picker" />}

      <div className="dashboard-sidebar-profile">
        <div
          ref={avatarRef}
          className="profile-avatar noselect"
          onClick={() => setShowEmojiPicker(prev => !prev)}
        >
          {user.emoji}
        </div>
        <div className="profile-name" title={user.username}>{user.username}</div>
        <img
          className="profile-settings noselect"
          onClick={onLogout}
          src={logoutIcon}
          alt="logout"
          title="Log Out"
        />
      </div>
    </div>
  );
}

export default Sidebar;