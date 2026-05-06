# Frontend Integration with Backend

## Connecting Your React Frontend to the Python Backend

### 1. Update API Base URL

Create a config file in your frontend:

```javascript
// src/config.js
export const API_BASE_URL = 'http://localhost:8000'; // Change to your deployed backend URL
```

### 2. Authentication Service

Create an auth service:

```javascript
// src/services/auth.js
import { API_BASE_URL } from '../config';

export const authService = {
  async login(username, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username,
        password,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    return data;
  },

  async register(userData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    
    return await response.json();
  },

  logout() {
    localStorage.removeItem('token');
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};
```

### 3. API Service for Menu Items

```javascript
// src/services/menu.js
import { API_BASE_URL } from '../config';

const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

export const menuService = {
  async getMenuItems() {
    const response = await fetch(`${API_BASE_URL}/menu`);
    if (!response.ok) throw new Error('Failed to fetch menu items');
    return await response.json();
  },

  async createMenuItem(item) {
    const response = await fetch(`${API_BASE_URL}/menu`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error('Failed to create menu item');
    return await response.json();
  },

  async updateMenuItem(id, item) {
    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error('Failed to update menu item');
    return await response.json();
  },

  async deleteMenuItem(id) {
    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete menu item');
    return await response.json();
  }
};
```

### 4. API Service for Bills

```javascript
// src/services/bills.js
import { API_BASE_URL } from '../config';

const getAuthHeaders = () => ({
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
    if (!response.ok) throw new Error('Failed to create bill');
    return await response.json();
  },

  async getBills() {
    const response = await fetch(`${API_BASE_URL}/bills`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch bills');
    return await response.json();
  }
};
```

### 5. API Service for Cash Entries

```javascript
// src/services/cash.js
import { API_BASE_URL } from '../config';

const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

export const cashService = {
  async getCashEntries() {
    const response = await fetch(`${API_BASE_URL}/cash`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch cash entries');
    return await response.json();
  },

  async createCashEntry(entry) {
    const response = await fetch(`${API_BASE_URL}/cash`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(entry),
    });
    if (!response.ok) throw new Error('Failed to create cash entry');
    return await response.json();
  },

  async updateCashEntry(id, entry) {
    const response = await fetch(`${API_BASE_URL}/cash/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(entry),
    });
    if (!response.ok) throw new Error('Failed to update cash entry');
    return await response.json();
  },

  async deleteCashEntry(id) {
    const response = await fetch(`${API_BASE_URL}/cash/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete cash entry');
    return await response.json();
  }
};
```

### 6. Update Your React Components

#### Update Admin Component

```javascript
// src/components/Admin/index.jsx
import { useState, useEffect } from "react";
import { menuService } from "../../services/menu";
import './index.css'

export default function Admin() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [items, setItems] = useState([]);

  // Load menu items from backend
  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      const menuItems = await menuService.getMenuItems();
      setItems(menuItems);
    } catch (error) {
      console.error('Failed to load menu items:', error);
      // Fallback to localStorage if backend fails
      setItems(JSON.parse(localStorage.getItem("menu")) || []);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addItem = async () => {
    if (!name || !price) return;

    try {
      const newItem = await menuService.createMenuItem({
        name,
        price: Number(price),
        image: image || null
      });

      setItems([...items, newItem]);
      
      // Reset form
      setName("");
      setPrice("");
      setImage("");
      setImagePreview("");
      const fileInput = document.getElementById("imageInput");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error('Failed to add item:', error);
      // Fallback to localStorage
      const newItem = { 
        name, 
        price: Number(price), 
        qty: 0,
        image: image || null
      };
      const updated = [...items, newItem];
      setItems(updated);
      localStorage.setItem("menu", JSON.stringify(updated));
    }
  };

  const deleteItem = async (id) => {
    try {
      await menuService.deleteMenuItem(id);
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to delete item:', error);
      // Fallback to localStorage
      const updated = items.filter((_, i) => i !== index);
      setItems(updated);
      localStorage.setItem("menu", JSON.stringify(updated));
    }
  };

  const editItem = async (id, currentItem) => {
    const newName = prompt("Enter new name", currentItem.name);
    const newPrice = prompt("Enter new price", currentItem.price);

    if (!newName || !newPrice) return;

    try {
      const updatedItem = await menuService.updateMenuItem(id, {
        name: newName,
        price: Number(newPrice),
        image: currentItem.image
      });

      setItems(items.map(item => item.id === id ? updatedItem : item));
    } catch (error) {
      console.error('Failed to update item:', error);
      // Fallback to localStorage
      const updated = [...items];
      const index = items.findIndex(item => item.id === id);
      updated[index] = { 
        ...updated[index], 
        name: newName, 
        price: Number(newPrice) 
      };
      setItems(updated);
      localStorage.setItem("menu", JSON.stringify(updated));
    }
  };

  // ... rest of your component remains the same
}
```

#### Update Menu Component

```javascript
// src/components/Menu/index.jsx
import { useState, useEffect } from "react";
import { menuService } from "../../services/menu";
import { billService } from "../../services/bills";
// ... other imports

export default function Menu() {
  const [items, setItems] = useState([]);
  // ... other state

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      const menuItems = await menuService.getMenuItems();
      setItems(menuItems);
    } catch (error) {
      console.error('Failed to load menu items:', error);
      // Fallback to localStorage
      setItems(getData("menu"));
    }
  };

  const saveBill = async () => {
    const bills = getData("bills") || [];

    try {
      // Save to backend
      await billService.createBill({
        items: selected,
        total
      });
    } catch (error) {
      console.error('Failed to save bill to backend:', error);
    }

    // Always save locally as backup
    bills.push({
      billNo,
      items: selected,
      total,
      date: new Date().toLocaleString(),
    });

    saveData("bills", bills);
    // ... rest of the function
  };

  // ... rest of your component
}
```

### 7. Add Login Component

Create a login component to authenticate users:

```javascript
// src/components/Login/index.jsx
import { useState } from 'react';
import { authService } from '../../services/auth';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await authService.login(username, password);
      onLogin();
    } catch (error) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Maaza Cafe Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
```

### 8. Update App.jsx

```javascript
// src/App.jsx
import { useState, useEffect } from 'react';
import { authService } from './services/auth';
import Login from './components/Login';
// ... other imports

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user is already authenticated
    if (authService.isAuthenticated()) {
      setIsAuthenticated(true);
      // You could fetch user info here
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      {/* Your existing app structure */}
      <button onClick={handleLogout} className="logout-btn">Logout</button>
      {/* Rest of your app */}
    </div>
  );
}

export default App;
```

## Data Storage Explanation

### How Data is Stored and Retrieved

1. **Centralized Database**: All data is now stored in MongoDB, which can be accessed from any device with proper authentication.

2. **Cross-Device Access**: 
   - Users authenticate with JWT tokens
   - Same data is available on all devices
   - Changes sync automatically across devices

3. **Data Flow**:
   - Frontend makes API calls to backend
   - Backend validates authentication and permissions
   - Data is stored/retrieved from MongoDB
   - Responses sent back to frontend

4. **Fallback Mechanism**: Your app includes localStorage fallback for offline functionality.

## Deployment Steps

### Backend Deployment (Render)

1. Create account at [render.com](https://render.com)
2. Connect your GitHub repository
3. Create a new **Web Service**
4. Set build command: `pip install -r requirements.txt`
5. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables:
   - `MONGO_URL`: Your MongoDB Atlas connection string
   - `DATABASE_NAME`: maaza_cafe
   - `SECRET_KEY`: A secure random string
7. Deploy!

### Frontend Deployment (Vercel/Netlify)

1. Update `API_BASE_URL` in config.js to your Render backend URL
2. Deploy to Vercel or Netlify as usual

### MongoDB Atlas Setup

1. Create account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create database user and whitelist your IP
4. Get connection string and update in backend .env

## Best Practices

### Security
- Always use HTTPS in production
- Store JWT tokens securely
- Validate all inputs on backend
- Use environment variables for secrets

### Performance
- Implement caching for frequently accessed data
- Use pagination for large datasets
- Optimize database queries with proper indexing

### Error Handling
- Implement proper error handling in API calls
- Provide user-friendly error messages
- Include fallback mechanisms for offline use