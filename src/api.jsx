class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('jwtToken');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('jwtToken', token);
    } else {
      localStorage.removeItem('jwtToken');
    }
  }

  async request(endpoint, { method = 'GET', data = null } = {}) {
    const config = {
      method,
      headers: { "Content-Type": "application/json" },
    };

    if (this.token) {
      config.headers.Authorization = this.token;
    }

    if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `Request failed with status ${response.status}`,
        }));
        throw new Error(errorData.message || 'An unknown error occurred.');
      }

      if (response.status === 204 || response.headers.get("Content-Length") === "0") {
        return null; // No content
      }

      return response.json();
    } catch (error) {
      console.error('API Client Error:', error.message);
      throw error;
    }
  }
}

const DEV = "http://localhost:3000/api";
const PROD = "https://messaging-app-api-cm0j.onrender.com/api";
export default new ApiClient(PROD);
