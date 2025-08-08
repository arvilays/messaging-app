import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import MembersList from "../components/MembersList";
import { usePolling } from "../hooks/usePolling";
import "../styles/dashboard.css";

const POLLING_INTERVAL = 5000; // 5 seconds

function Dashboard() {
  const [user, setUser] = useState(null);
  const [currentConversationId, setCurrentConversationId] = useState("global");
  const [conversationData, setConversationData] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [error, setError] = useState(null);

  const { apiClient, token, setToken } = useOutletContext();
  const navigate = useNavigate();
  const chatInputRef = useRef(null);

  const handleLogout = useCallback(() => {
    setToken(null);
    navigate("/");
  }, [setToken, navigate]);

  const handleConversationCreated = (newConversationId) => {
    fetchUser();
    setCurrentConversationId(newConversationId);
  };

  const handleConversationLeave = () => {
    fetchUser();
    setCurrentConversationId("global");
  };

  const fetchUser = useCallback(async () => {
    try {
      const data = await apiClient.request("/user");
      setUser(data);
    } catch (err) {
      handleLogout();
    }
  }, [apiClient, handleLogout]);

  const fetchConversation = useCallback(async (id, isBackgroundFetch = false) => {
    if (!pageLoading && !isBackgroundFetch) setIsChatLoading(true);
    setError(null);
    try {
      const data = await apiClient.request(`/conversation/${id}`);
      setConversationData(data);
    } catch (err) {
      setError({ message: err.message, status: err.status });
    } finally {
      if (!pageLoading && !isBackgroundFetch) setIsChatLoading(false);
    }
  }, [apiClient, pageLoading]);

  const postMessage = async (message) => {
    await apiClient.request(`/message`, {
      method: "POST",
      data: { conversationId: currentConversationId, message },
    });
    pollForUpdates();
  };

  const pollForUpdates = useCallback(async () => {
    if (conversationData?.messages?.length > 0) {
      const lastMessage = conversationData.messages[conversationData.messages.length - 1];
      const newMessages = await apiClient.request(
        `/conversation/${currentConversationId}/messages/new?since=${lastMessage.createdAt}`
      );
      if (newMessages.length > 0) {
        setConversationData(prev => ({ ...prev, messages: [...prev.messages, ...newMessages] }));
      }
    } else if (currentConversationId) {
      fetchConversation(currentConversationId, true);
    }

    fetchUser();
  }, [conversationData, currentConversationId, fetchUser, fetchConversation, apiClient]);

  usePolling(pollForUpdates, POLLING_INTERVAL);

  // Navigate to welcome page if token doesn't exist
  useEffect(() => {
    if (!token) navigate("/");
    else {
      Promise.all([fetchUser(), fetchConversation("global")]).finally(() => setPageLoading(false));
    }
  }, [token, navigate]);

  // Fetches conversation data whenever user clicks a conversation
  useEffect(() => {
    if (!pageLoading) {
      fetchConversation(currentConversationId);
    }
  }, [currentConversationId, pageLoading, fetchConversation]);

  // When chat is loaded, auto-focus chat bar
  useEffect(() => {
    if (!isChatLoading && chatInputRef.current) {
      chatInputRef.current.focus();
    }
  }, [isChatLoading]);

  if (pageLoading) return <div className="loading-container">Loading Dashboard...</div>;
  if (error) {
    switch (error.status) {
      case 401: // Unauthorized
        return <div className="error-container">Session expired. Please log in again.</div>;

      case 403: // Forbidden
        return <div className="error-container">You are not authorized to view this.</div>;

      case 404: // Not Found
        return <div className="error-container">The resource you requested could not be found.</div>;

      default:
        return <div className="error-container">Error: {error.message}</div>;
    }
  }
  if (!user) return null;

  return (
    <div className="dashboard-container">
      <Sidebar
        user={user}
        currentConversationId={currentConversationId}
        onConversationSelect={setCurrentConversationId} 
        onConversationCreated={handleConversationCreated}
        onConversationUpdate={fetchUser}
        onLogout={handleLogout}
        apiClient={apiClient}
      />
      <ChatWindow
        ref={chatInputRef}
        isLoading={isChatLoading}
        conversationData={conversationData}
        onPostMessage={postMessage}
      />
      <MembersList
        conversationData={conversationData}
        onMemberUpdate={() => Promise.all([fetchConversation(currentConversationId), fetchUser()])}
        onConversationLeave={handleConversationLeave}
        apiClient={apiClient}
      />
    </div>
  );
}

export default Dashboard;