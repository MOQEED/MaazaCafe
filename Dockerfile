# Build the frontend with Node 18
FROM node:18-bullseye AS frontend
WORKDIR /app
COPY MaazaCafe/package.json MaazaCafe/package-lock.json* ./MaazaCafe/
COPY MaazaCafe/ ./MaazaCafe/
WORKDIR /app/MaazaCafe
RUN npm install
RUN npm run build

# Build the backend with Python 3.11 and copy frontend output into static folder
FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y build-essential curl && rm -rf /var/lib/apt/lists/*
COPY backend/ ./backend/
COPY --from=frontend /app/MaazaCafe/dist ./backend/static
WORKDIR /app/backend
RUN python -m pip install --upgrade pip
RUN pip install -r requirements.txt
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]