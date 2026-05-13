import { API_BASE_URL } from "../config";

const authHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

export const menuService = {
  async getMenuItems() {
    const response = await fetch(`${API_BASE_URL}/menu`);
    if (!response.ok) throw new Error('Failed to load menu items');
    return await response.json();
  },

  async createMenuItem(item) {
    try {
      const response = await fetch(`${API_BASE_URL}/menu`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(item),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => null);
        console.error('Menu API error:', response.status, err);
        throw new Error(err?.detail || 'Failed to create menu item');
      }
      return await response.json();
    } catch (error) {
      console.error('Menu service error:', error);
      throw error;
    }
  },

  async updateMenuItem(id, item) {
    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.detail || 'Failed to update menu item');
    }
    return await response.json();
  },

  async deleteMenuItem(id) {
    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.detail || 'Failed to delete menu item');
    }
    return await response.json();
  },
};
