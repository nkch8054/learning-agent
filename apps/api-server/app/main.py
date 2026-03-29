from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import analyze

app = FastAPI(title="Nexus AI Learning Agent")

# Enable CORS so the VS Code extension can talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your extension ID
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include our routes
app.include_router(analyze.router)

@app.get("/")
async def root():
    return {
        "status": "online",
        "agent": "Nexus AI Learning Agent",
        "version": "1.0.0-mvp"
    }