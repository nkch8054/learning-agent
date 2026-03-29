# Code-to-Docs Matching Engine (API Server)

This is an AI-powered backend that crawls official documentation for 5 major libraries and matches user code snippets to the most relevant documentation using Vector Search and Reranking.

### Supported Libraries:
- **ReactJS** (Web/Frontend)
- **Node.js** (Server-side JS)
- **TypeScript** (Static Typing)
- **Go** (Golang Standard Lib)
- **Java** (Spring Boot/Standard)

---

## 🛠 Prerequisites

- **Python 3.12.8** (Stable version)
- **OpenAI API Key** (For embeddings)
- **Cohere API Key** (For reranking precision)

---

## 🚀 Setup & Installation

### 1. Initialize Virtual Environment
Depending on your terminal, use the correct activation command:

```bash
# Create the environment
python -m venv venv

# Activate (Bash / Git Bash)
source venv/Scripts/activate

# Activate (Windows Command Prompt)
venv\Scripts\activate

# Activate (PowerShell)
.\venv\Scripts\Activate.ps1
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

---

## 🏗 Operations

### Step 1: Feed the Vector Database (Ingestion)
Run the scraper to crawl documentation sites and save them into the `chroma_db_docs/` folder. This only needs to be run once (or weekly).

```bash
# Run from the api-server root directory
export PYTHONPATH=$PYTHONPATH:.
python app/worker/scraper.py
```

### Step 2: Start the API Server
Launch the FastAPI server with auto-reload for development.

```bash
uvicorn app.main:app --reload
```
*The API will be available at:* `http://127.0.0.1:8000`

---

## 🧪 Testing the API

You can test the matching logic using `curl` or Postman.

**Endpoint:** `POST /api/v1/analyze`

**Payload:**
```json
{
  "code": "const [data, setData] = useState(null);",
  "language": "reactjs"
}
```

**Example Curl Command:**
```bash
curl -X POST http://127.0.0.1:8000/api/v1/analyze \
     -H "Content-Type: application/json" \
     -d '{"code": "func main() { fmt.Println(\"hi\") }", "language": "golang"}'
```

---

## 📂 Project Structure

- `app/api/routes/`: FastAPI endpoint definitions.
- `app/core/rag_engine.py`: Logic for semantic search and Cohere reranking.
- `app/db/vector_store.py`: Connection logic for ChromaDB.
- `app/worker/scraper.py`: The documentation crawler logic.

---

## ❓ Troubleshooting

**Error: `ModuleNotFoundError: No module named 'app'`**
Run the script using the `-m` flag or set your PYTHONPATH:
`set PYTHONPATH=.` (Windows CMD) or `export PYTHONPATH=.` (Bash).

**Error: `python was not found`**
Ensure you are using **Python 3.12.8** and that you checked "Add to PATH" during installation. Try using the `py` command instead of `python`.