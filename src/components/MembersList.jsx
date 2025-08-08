import { useState, useEffect, useRef } from "react";
import leaveIcon from "../assets/exit-run.svg";

function MembersList({ conversationData, onMemberUpdate, apiClient, onConversationLeave }) {
  const [showAddUser, setShowAddUser] = useState(false);
  const [addUser, setAddUser] = useState("");
  const [showLeaveConversation, setShowLeaveConversation] = useState(false);

  const leaveButtonRef = useRef(null);
  const leaveWindowRef = useRef(null);

  const handleAddUser = async () => {
    if (!addUser.trim()) return;

    try {
      await apiClient.request("/conversation-add-user", {
        method: "POST",
        data: { addUsername: addUser, conversationId: conversationData.id},
      });

      onMemberUpdate();

      setAddUser("");
      setShowAddUser(false);
    } catch (err) {
      alert("Error adding user: " + err.message);
    }
  };

  const handleLeaveConversation = async () => {
    try {
      await apiClient.request("/conversation-leave", {
        method: "POST",
        data: { conversationId: conversationData.id },
      });
      setShowLeaveConversation(false);
      onConversationLeave();
    } catch (err) {
      alert("Error leaving conversation: " + err.message);
      setShowLeaveConversation(false);
    }
  };

  // Handles closing the "Leave Conversation" window when the user clicks out of it
  useEffect(() => {
    const handleClick = (event) => {
      if (leaveButtonRef.current && leaveButtonRef.current.contains(event.target)) {
        return;
      }
      if (leaveWindowRef.current && !leaveWindowRef.current.contains(event.target)) {
        setShowLeaveConversation(false);
      }
    };

    if (showLeaveConversation) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [showLeaveConversation]);

  // Resets UI when conversation data changes
  useEffect(() => {
    setShowAddUser(false);
    setAddUser("");
    setShowLeaveConversation(false);
  }, [conversationData]);

  // Resets the "Add User" form whenever it is opened or closed
  useEffect(() => {
    setAddUser("");
  }, [showAddUser]);

  if (!conversationData.users || conversationData.users.length === 0) {
    return (
      <div className="dashboard-members">
        <div className="dashboard-members-header">Members</div>
      </div>
    );
  }

  return (
    <div className="dashboard-members">
      <div className="dashboard-members-header">
        <div className="dashboard-members-title">Members — {conversationData.users.length}</div>
        {conversationData.id !== "global" &&
          <div
            className="dashboard-members-add noselect"
            title="Add New User"
            onClick={() => setShowAddUser(!showAddUser)}
          >
            {showAddUser ? "—" : "+"}
          </div>
        }
      </div>

      {showAddUser && (
        <div className="conversation-category-add-users noselect">
            <input
              type="text"
              value={addUser}
              onChange={(e) => setAddUser(e.target.value)}
              placeholder="Username"
            />
          <button className="create-conversation" onClick={handleAddUser}>Add User</button>
        </div>
      )}

      <div className="dashboard-members-list">
        {[...conversationData.users]
          .sort((a, b) =>
            a.username.localeCompare(b.username, undefined, { sensitivity: 'base' })
          )
          .map((user) => (
          <div className="dashboard-members-user" key={user.username}>
            <div className="dashboard-members-avatar noselect">{user.emoji || '👤'}</div>
            <div className="dashboard-members-username" title={user.username}>{user.username}</div>
          </div>
        ))}
      </div>

      {conversationData.id !== "global" && (
        <div 
          ref={leaveButtonRef}
          className="dashboard-members-leave"
          onClick={() => setShowLeaveConversation(!showLeaveConversation)}  
        >
          <img src={leaveIcon} alt="leave conversation" title="Leave Conversation" />
        </div>
      )}

      {conversationData.id !== "global" && showLeaveConversation && (
        <div ref={leaveWindowRef} className="dashboard-leave-confirm">
          <div className="dashboard-leave-confirm-title">Leave Conversation?</div>
          <div className="dashboard-leave-confirm-choices">
            <div
              className="dashboard-leave-confirm-choice dashboard-leave-confirm-yes"
              onClick={handleLeaveConversation}
            >
              Yes
            </div>
            <div
              className="dashboard-leave-confirm-choice dashboard-leave-confirm-no"
              onClick={() => setShowLeaveConversation(false)}
            >
              No
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MembersList;