import { useState, useEffect, useCallback } from "react";
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
  const [lastUserFetch, setLastUserFetch] = useState(new Date().toISOString());

  const [pageLoading, setPageLoading] = useState(true);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [error, setError] = useState(null);

  const { apiClient, token, setToken } = useOutletContext();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    setToken(null);
    navigate("/");
  }, [setToken, navigate]);

  const fetchUser = useCallback(async () => {
    try {
      const data = await apiClient.request("/user");
      setUser(data);
      setLastUserFetch(new Date().toISOString());
    } catch (err) {
      handleLogout();
    }
  }, [apiClient, handleLogout]);

  const fetchConversation = useCallback(async (id) => {
    if (!pageLoading) setIsChatLoading(true);
    setError(null);
    try {
      const data = await apiClient.request(`/conversation/${id}`);
      setConversationData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      if (!pageLoading) setIsChatLoading(false);
    }
  }, [apiClient, pageLoading]);

  const pollForUpdates = useCallback(async () => {
    if (conversationData?.messages?.length > 0) {
      const lastMessage = conversationData.messages[conversationData.messages.length - 1];
      const newMessages = await apiClient.request(
        `/conversation/${currentConversationId}/messages/new?since=${lastMessage.createdAt}`
      );
      if (newMessages.length > 0) {
        setConversationData(prev => ({ ...prev, messages: [...prev.messages, ...newMessages] }));
      }
    }

    const updates = await apiClient.request(`/conversations/updates?since=${lastUserFetch}`);
    if (updates.hasUpdates) {
      fetchUser();
    }
  }, [apiClient, conversationData, currentConversationId, lastUserFetch, fetchUser]);

  usePolling(pollForUpdates, POLLING_INTERVAL);

  useEffect(() => {
    if (!token) navigate("/");
    else {
      Promise.all([fetchUser(), fetchConversation(currentConversationId)])
        .finally(() => setPageLoading(false));
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!pageLoading) {
      fetchConversation(currentConversationId);
    }
  }, [currentConversationId, pageLoading, fetchConversation]);

  const postMessage = async (message) => {
    await apiClient.request(`/message`, {
      method: "POST",
      data: { conversationId: currentConversationId, message },
    });
    pollForUpdates();
  };

  if (pageLoading) return <div className="loading-container">Loading Dashboard...</div>;
  if (error) return <div className="error-container">Error: {error}</div>;
  if (!user) return null;

  return (
    <div className="dashboard-container">
      <Sidebar
        user={user}
        currentConversationId={currentConversationId}
        setCurrentConversationId={setCurrentConversationId}
        onLogout={handleLogout}
        onConversationsUpdate={fetchUser}
        apiClient={apiClient}
      />
      <ChatWindow
        isLoading={isChatLoading}
        conversationData={conversationData}
        onPostMessage={postMessage}
      />
      <MembersList users={conversationData?.users} />
    </div>
  );
}

export default Dashboard;