import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import logoImage from "../assets/echo_logo.png";
import "../styles/welcome.css";

function Welcome() {
  const [isLoginView, setIsLoginView] = useState(true);
  const { apiClient, setToken } = useOutletContext();
  const navigate = useNavigate();

  const handleAuthSuccess = (token) => {
    setToken(token);
    navigate("/dashboard");
  };

  return (
    <div className="welcome-container">
      <img className="echo-logo" src={logoImage} alt="echo messenger" />
      <div className="echo-title">echo</div>
      <div className="echo-subtitle">messenger</div>

      <AuthForm
        isLogin={isLoginView}
        apiClient={apiClient}
        onAuthSuccess={handleAuthSuccess}
      />

      <div className="welcome-link" onClick={() => setIsLoginView(!isLoginView)}>
        {isLoginView ? "Sign Up" : "Log In"}
      </div>
    </div>
  );
}

export default Welcome;