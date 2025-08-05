import { useState, useMemo } from "react";
import { Outlet } from "react-router-dom";
import apiClient from "./api";

function App() {
  const [token, setToken] = useState(apiClient.token);

  const handleSetToken = (newToken) => {
    apiClient.setToken(newToken);
    setToken(newToken);
  };

  const context = useMemo(() => ({
    apiClient,
    token,
    setToken: handleSetToken
  }), [token]);

  return <Outlet context={context} />;
}

export default App;