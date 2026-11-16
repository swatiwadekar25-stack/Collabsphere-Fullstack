
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function apiRequest(path, options = {}) {
  let savedAuth = {};
  try {
    savedAuth = JSON.parse(localStorage.getItem("collabsphere_auth") || "{}");
  } catch {
    localStorage.removeItem("collabsphere_auth");
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(savedAuth.token
          ? { Authorization: `Bearer ${savedAuth.token}` }
          : {}),
        ...options.headers,
      },
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        `Cannot reach the backend at ${API_BASE_URL}. Start the backend and check the API URL and CORS settings.`,
      );
    }
    throw error;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}
