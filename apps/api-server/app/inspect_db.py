import chromadb

# 1. Connect to the database folder
# Note: Use the FOLDER path, not the .sqlite3 file path
CHROMA_PATH = "./chroma_db_docs"
client = chromadb.PersistentClient(path=CHROMA_PATH)

def view_all_data():
    # 2. Get a list of all collections (libraries) created
    collections = client.list_collections()
    
    if not collections:
        print("No collections found in the database.")
        return

    print(f"Found {len(collections)} collections: {[c.name for c in collections]}")
    print("=" * 50)

    for col_info in collections:
        collection = client.get_collection(name=col_info.name)
        count = collection.count()
        
        print(f"\n📂 COLLECTION: {col_info.name}")
        print(f"🔢 Total Chunks: {count}")
        
        if count > 0:
            # 3. Retrieve all data from this collection
            # Using .get() without IDs returns everything
            # We include documents and metadatas, excluding large embeddings for readability
            data = collection.get(include=["documents", "metadatas"])
            
            # Print the first 20 items as a sample to avoid flooding the screen
            sample_size = min(300, count)
            print(f"📝 Showing first {sample_size} chunks:")
            
            for i in range(sample_size):
                print(f"\n--- Chunk {i+1} ---")
                print(f"Metadata: {data['metadatas'][i]}")
                # Print first 200 characters of the text
                print(f"Snippet: {data['documents'][i][:200]}...") 
        else:
            print("Empty collection.")
            
        print("-" * 50)

if __name__ == "__main__":
    view_all_data()