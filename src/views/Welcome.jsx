import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import logoImage from "../assets/echo_logo.png";
import "../styles/welcome.css";

function Welcome() {
  const [view, setView] = useState("login");

  const { apiClient, token, setToken } = useOutletContext();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      const data = await apiClient.request('/login', {
        method: 'POST',
        data: { username, password },
      });
      localStorage.setItem('jwtToken', data.token);
      setToken(data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(`Error: ` + err.message);
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      await apiClient.request("/signup", {
        method: "POST",
        data: { username, password, confirmPassword },
      });
      alert("Signup successful!");
      setView("login");
    } catch (err) {
      alert(err.message || "An error occurred during signup.");
    }
  };

  return (
    <div className="welcome-container">
      <img className="echo-logo" src={logoImage} alt="echo messenger" />
      <div className="echo-title">echo</div>
      <div className="echo-subtitle">messenger</div>

      { view === "login" ? ( 
        <div className="auth-container">
          <form onSubmit={handleLogin}>
            <input type="text" name="username" placeholder="Username" required />
            <input type="password" name="password" placeholder="Password" required />
            <button>Log In</button>
          </form>
          <div className="welcome-link" onClick={() => setView("signup")}>Sign Up</div>
        </div>
      ) : (
          <div className="auth-container">
          <form onSubmit={handleSignup}>
            <input type="text" name="username" placeholder="Username" required />
            <input type="password" name="password" placeholder="Password" required />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" required />
            <button>Create Account</button>
          </form>
          <div className="welcome-link" onClick={() => setView("login")}>Log In</div>
        </div>
      )}
    </div>
  );
}

export default Welcome;