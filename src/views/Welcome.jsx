import { useState } from "react";
import logoImage from "../assets/echo_logo.png";
import "../styles/welcome.css";

function Welcome() {
  const [view, setView] = useState("login");
  
  return (
    <div className="welcome-container">
      <img className="echo-logo" src={logoImage} alt="echo messenger" />
      <div className="echo-title">echo</div>
      <div className="echo-subtitle">messenger</div>

      { view === "login" ? ( 
        <div className="auth-container">
          <form action="">
            <input type="text" placeholder="Username" />
            <input type="text" placeholder="Password" />
            <button>Log In</button>
          </form>
          <div className="welcome-link" onClick={() => setView("signup")}>Sign Up</div>
        </div>
      ) : (
          <div className="auth-container">
          <form action="">
            <input type="text" placeholder="Username" />
            <input type="text" placeholder="Password" />
            <input type="text" placeholder="Confirm Password" />
            <button>Create Account</button>
          </form>
          <div className="welcome-link" onClick={() => setView("login")}>Log In</div>
        </div>
      )}
    </div>
  );
}

export default Welcome;