from app.db.vector_store import get_vector_db
from langchain_classic.retrievers.contextual_compression import ContextualCompressionRetriever
from langchain_cohere import CohereRerank

def match_code_to_docs(user_query: str, library_filter: str = None):
    db = get_vector_db()
    
    # 1. Setup Metadata Filtering (If user knows they are using Go vs Java)
    search_kwargs = {"k": 10}
    if library_filter:
        search_kwargs["filter"] = {"library": library_filter}

    # 2. Setup Reranker (Crucial for code accuracy)
    compressor = CohereRerank(model="rerank-english-v3.0", top_n=5)
    
    compression_retriever = ContextualCompressionRetriever(
        base_compressor=compressor, 
        base_retriever=db.as_retriever(search_kwargs=search_kwargs)
    )

    # 3. Retrieve
    relevant_docs = compression_retriever.invoke(user_query)
    
    return relevant_docs