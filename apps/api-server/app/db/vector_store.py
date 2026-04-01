from langchain_voyageai import VoyageAIEmbeddings
from langchain_chroma import Chroma
from dotenv import load_dotenv

load_dotenv()

# Initialize Embeddings (Optimized for technical content)
embeddings = VoyageAIEmbeddings(model="voyage-code-2")

# Persistent directory for the Vector DB
CHROMA_PATH = "chroma_db_docs"

def get_vector_db():
    return Chroma(
        persist_directory=CHROMA_PATH,
        embedding_function=embeddings
    )

def save_to_db(chunks, batch_size=5000):
    db = get_vector_db()
    for i in range(0, len(chunks), batch_size):
        batch = chunks[i:i+batch_size]
        db.add_documents(batch)
    print(f"✅ Successfully saved {len(chunks)} chunks to DB.")