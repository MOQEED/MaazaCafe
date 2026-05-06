import { API_BASE_URL } from "../config";

const authHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

export const authService = {
  async login(username, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('isAuth', 'true');
    return data;
  },

  async getProfile() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: authHeaders(),
    });

    if (!response.ok) {
      throw new Error('Unable to fetch profile');
    }

    return await response.json();
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuth');
    localStorage.removeItem('ownerAuth');
  },
};
