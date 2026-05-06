import { API_BASE_URL } from "../config";

const authHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

export const billService = {
  async createBill(billData) {
    const response = await fetch(`${API_BASE_URL}/bills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(billData),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.detail || 'Failed to create bill');
    }
    return await response.json();
  },

  async getBills() {
    const response = await fetch(`${API_BASE_URL}/bills`, {
      headers: authHeaders(),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.detail || 'Failed to load bills');
    }
    return await response.json();
  },

  async deleteBill(id) {
    const response = await fetch(`${API_BASE_URL}/bills/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.detail || 'Failed to delete bill');
    }
    return await response.json();
  },
};
