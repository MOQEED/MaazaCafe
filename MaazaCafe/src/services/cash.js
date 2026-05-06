import { API_BASE_URL } from "../config";

const authHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

export const cashService = {
  async getCashEntries() {
    const response = await fetch(`${API_BASE_URL}/cash`, {
      headers: authHeaders(),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.detail || 'Failed to load cash entries');
    }
    return await response.json();
  },

  async createCashEntry(entry) {
    const response = await fetch(`${API_BASE_URL}/cash`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(entry),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.detail || 'Failed to create cash entry');
    }
    return await response.json();
  },

  async deleteCashEntry(id) {
    const response = await fetch(`${API_BASE_URL}/cash/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.detail || 'Failed to delete cash entry');
    }
    return await response.json();
  },
};
