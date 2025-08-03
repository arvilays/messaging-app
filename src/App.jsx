import { useState, useEffect, useMemo } from "react";
import { Outlet } from "react-router-dom";
import apiClient from "./api";

function App() {
  const [token, setToken] = useState(localStorage.getItem('jwtToken'));

  const context = useMemo(() => ({ apiClient, token, setToken }), [token]);

  useEffect(() => {
    const storedToken = localStorage.getItem('jwtToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <>
      <Outlet context={context} />
    </>
  )
};

export default App;