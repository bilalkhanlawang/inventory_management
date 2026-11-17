const API_URL = "http://localhost:3000/api";

function translateError(msg) {
  if (!msg) return "Something went wrong. Please try again.";
  const lower = msg.toLowerCase();
  if (lower.includes("incorrect email or password")) return "The email or password you entered is incorrect.";
  if (lower.includes("provide email")) return "Please enter your email address.";
  if (lower.includes("provide password")) return "Please enter your password.";
  return msg;
}

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  let response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, config);
  } catch (err) {
    throw new Error("Cannot connect to server. Please check your connection.");
  }

  if (response.status === 204) return null;

  // چک کردن اینکه بک‌اند جواب JSON داده یا HTML
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error("Server error. Please check if the backend is running.");
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(translateError(data.message || "Error in the request"));
  }

  return data;
}

export const api = {
  get: (endpoint) => apiRequest(endpoint, { method: "GET" }),
  post: (endpoint, body) => apiRequest(endpoint, { method: "POST", body: JSON.stringify(body) }),
  put: (endpoint, body) => apiRequest(endpoint, { method: "PUT", body: JSON.stringify(body) }),
  patch: (endpoint, body) => apiRequest(endpoint, { method: "PATCH", body: JSON.stringify(body) }),
  delete: (endpoint) => apiRequest(endpoint, { method: "DELETE" }),
};