from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import connect_to_mongo, close_mongo_connection
from app.routes import auth, menu, bills, cash

app = FastAPI(title="Maaza Cafe Backend", version="1.0.0")

# CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection events
@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(menu.router, prefix="/menu", tags=["Menu"])
app.include_router(bills.router, prefix="/bills", tags=["Bills"])
app.include_router(cash.router, prefix="/cash", tags=["Cash"])

# Mount static files (frontend build) - serves the React app
from fastapi.staticfiles import StaticFiles
import os
if os.path.exists("static"):
    app.mount("/", StaticFiles(directory="static", html=True), name="static")

@app.get("/")
async def root():
    return {"message": "Welcome to Maaza Cafe Backend API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)