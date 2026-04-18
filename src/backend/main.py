from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import api_router
import uvicorn

app = FastAPI(title="LatentSpace API", version="1.0.0")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(api_router, prefix="/api")

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "LatentSpace API is running"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)