# Maaza Cafe

A full-stack cafe management application with a React frontend and FastAPI/MongoDB backend.

## Overview

This repository contains:

- `MaazaCafe/`: React frontend built with Vite
- `backend/`: FastAPI backend with MongoDB and JWT authentication

The application supports:

- menu management
- billing and sales reports
- cash entries
- admin/owner authentication
- frontend/backend integration via REST APIs

---

## Repository Structure

```
MaazaCafe/
├── backend/             # FastAPI backend
│   ├── app/
│   ├── requirements.txt
│   └── .env
├── MaazaCafe/           # React frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
└── README.md            # This file
```

---

## Requirements

- Node.js 18+ (or compatible)
- npm
- Python 3.10+ (or compatible)
- MongoDB
  - Local MongoDB service, or
  - MongoDB Atlas cloud database

---

## Backend Setup

### 1. Configure MongoDB

#### Option A: MongoDB Atlas (recommended)

1. Create a free cluster at https://www.mongodb.com/atlas.
2. Add a database user with a password.
3. Add your IP address or `0.0.0.0/0` to the IP access list.
4. Copy the connection string.

#### Option B: Local MongoDB

1. Install MongoDB and start the service.
2. Use `mongodb://localhost:27017` as the connection string.

### 2. Create `backend/.env`

In `backend/.env`, add:

```env
MONGO_URL=mongodb://localhost:27017
DATABASE_NAME=maaza_cafe
SECRET_KEY=your-super-secret-key
```

If using Atlas, replace `MONGO_URL` with your Atlas URI.

### 3. Install backend dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 4. Initialize the database

```bash
python init_db.py
```

This script creates default user credentials:

- Admin: `admin` / `admin123`
- Owner: `owner` / `owner123`

### 5. Run the backend server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend API will be available at:

- `http://localhost:8000`
- Swagger docs: `http://localhost:8000/docs`
- ReDoc docs: `http://localhost:8000/redoc`

---

## Frontend Setup

### 1. Install frontend dependencies

```bash
cd MaazaCafe
npm install
```

### 2. Run the frontend

```bash
npm run dev
```

The frontend will run at:

- `http://localhost:5173`

### 3. Connect frontend to backend

For local development, the React application will call the backend at `http://localhost:8000` while Vite is running on `http://localhost:5173`.

For production deployment using the single-link Render/Railway setup, the frontend is served from the same backend origin and automatically calls the API on the same domain.

---

## Run the full application

Open two terminals:

1. Backend:

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

2. Frontend:

```bash
cd MaazaCafe
npm run dev
```

Then open `http://localhost:5173` in your browser.

---

## Default Users

Use the following credentials after running `init_db.py`:

- Admin user:
  - username: `admin`
  - password: `admin123`
- Owner user:
  - username: `owner`
  - password: `owner123`

---

## Deployment

### Deploy to Render (Single Link - Recommended)

This repository includes a `render.yaml` configuration for full-stack deployment with one URL.

#### Steps:

1. **Push to GitHub**: Ensure your code is pushed to `https://github.com/MOQEED/MaazaCafe.git`

2. **Create Render Account**: Sign up at https://render.com

3. **Connect Repository**:
   - Go to Dashboard > New > Blueprint
   - Connect your GitHub repo: `MOQEED/MaazaCafe`
   - Render will detect the `render.yaml` file

4. **Configure Environment Variables**:
   - Set:
     - `MONGO_URL`: Your MongoDB Atlas connection string
     - `DATABASE_NAME`: `maaza_cafe`
     - `SECRET_KEY`: A secure random string

5. **Deploy**: Click "Create Blueprint" - Render will build the Docker image using `Dockerfile` and deploy both frontend and backend in one service.

6. **Access Your App**:
   - Single URL: The generated URL serves both the React frontend and FastAPI backend API
   - Frontend: `https://your-app.onrender.com`
   - Backend API: `https://your-app.onrender.com/docs` (Swagger UI)

#### Notes:
- This setup uses Docker to force Python 3.11 and Node 18, avoiding Render's default Python 3.14 issue
- One deployment link for the entire application
- Frontend and backend communicate on the same domain
- Free tier has usage limits; upgrade for production

### Deploy to Railway (Single Link)

This repository includes a root `railway.toml` for full-stack deployment with one URL.

#### Steps:

1. **Push to GitHub**: Ensure your code is pushed to `https://github.com/MOQEED/MaazaCafe.git`

2. **Create Railway Account**: Sign up at https://railway.app

3. **Create Project**:
   - Go to Dashboard > New Project > Deploy from GitHub repo
   - Select `MOQEED/MaazaCafe`

4. **Configure Environment Variables**:
   - `MONGO_URL`: Your MongoDB Atlas connection string
   - `DATABASE_NAME`: `maaza_cafe`
   - `SECRET_KEY`: A secure random string

5. **Deploy**: Railway will build both frontend and backend, then deploy

6. **Access Your App**:
   - Single URL: The Railway URL serves both the React frontend and FastAPI backend API
   - Frontend: `https://your-project.railway.app`
   - Backend API: `https://your-project.railway.app/docs` (Swagger UI)

#### Notes:
- One deployment link for the entire application
- Frontend and backend communicate on the same domain
- Railway provides a free tier for testing

If you prefer one-click deployment, use Render with the included `render.yaml` - it handles both services automatically.

### Alternative: Deploy Separately

- **Backend**: Deploy FastAPI on Render, Railway, or Fly.io
- **Frontend**: Deploy React on Vercel or Netlify
- Update `MaazaCafe/src/config.js` with the deployed backend URL

---

## Notes

- Make sure `backend/.env` contains a secure `SECRET_KEY` before deploying.
- If using MongoDB Atlas, keep your connection string secret.
- For production, use environment variables instead of hardcoding values.

---

## GitHub

This project is hosted at: https://github.com/MOQEED/MaazaCafe.git
