import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import logoImage from "../assets/echo_logo.png";
import "../styles/welcome.css";

function Welcome() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const { apiClient, token, setToken } = useOutletContext();
  const navigate = useNavigate();

  const handleAuthSuccess = (token) => {
    setToken(token);
    navigate("/dashboard");
  };

  const handleGuestSignup = async () => {
    setIsGuestLoading(true);
    try {
      const response = await apiClient.request("/guest-signup", { method: "POST" });
      setToken(response.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Could not create a guest account. Please try again.");
      setIsGuestLoading(false);
    }
  };

  // Navigate to dashboard if token already exists
  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  return (
    <>
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
          {isLoginView ? "Need an account? Sign Up" : "Already have an account? Log In"}
        </div>

        <div className="guest-login">
          <button
            onClick={handleGuestSignup}
            disabled={isGuestLoading}
          >
            {isGuestLoading ? "Creating Account..." : "Guest Login ➡️"}
          </button>
        </div>
      </div>

      <div className="credits-dev">
        Messaging App Project by&nbsp;
        <a
          href="https://github.com/arvilays"
          target="_blank"
          rel="noopener noreferrer"
        >
          arvilays
        </a>
      </div>
    </>
  );
}

export default Welcome;