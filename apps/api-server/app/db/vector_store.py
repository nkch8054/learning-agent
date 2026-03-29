import os
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from dotenv import load_dotenv

load_dotenv()

# Initialize Embeddings (Optimized for technical content)
embeddings = OpenAIEmbeddings(model="text-embedding-3-large")

# Persistent directory for the Vector DB
CHROMA_PATH = "chroma_db_docs"

def get_vector_db():
    return Chroma(
        persist_directory=CHROMA_PATH,
        embedding_function=embeddings
    )

def save_to_db(chunks):
    db = get_vector_db()
    db.add_documents(chunks)
    print(f"✅ Successfully saved {len(chunks)} chunks to DB.")