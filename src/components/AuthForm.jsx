import { useState } from "react";

function AuthForm({ isLogin, apiClient, onAuthSuccess }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    if (!isLogin && data.password !== data.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const response = await apiClient.request("/login", {
          method: "POST",
          data,
        });
        onAuthSuccess(response.token);
      } else {
        await apiClient.request("/signup", {
          method: "POST",
          data,
        });

        const response = await apiClient.request("/login", {
          method: "POST",
          data: { username: data.username, password: data.password },
        });
        onAuthSuccess(response.token);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="signup-disclaimer">
            You will be automatically logged into a global chat. Your username will be visible to everyone, so please do not share any sensitive information.
          </div>
        )}
        <input type="text" name="username" placeholder="Username" required minlength="1" maxlength="32" />
        <input type="password" name="password" placeholder="Password" minlength="3" required />
        {!isLogin && (
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            minlength="3"
            required
          />
        )}
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : isLogin ? "Log In" : "Create Account"}
        </button>
        {error && <div className="auth-error">{error}</div>}
      </form>
    </div>
  );
}

export default AuthForm;