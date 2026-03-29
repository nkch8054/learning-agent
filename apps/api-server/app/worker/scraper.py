import asyncio
from langchain_community.document_loaders import RecursiveUrlLoader, SitemapLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.db.vector_store import save_to_db
from bs4 import BeautifulSoup as Soup

# Config for the 5 libraries
DOCS_SOURCES = {
    "reactjs": "https://react.dev/reference/react",
    "nodejs": "https://nodejs.org/api/",
    "typescript": "https://www.typescriptlang.org/docs/",
    "golang": "https://pkg.go.dev/std",
    "java_spring": "https://docs.spring.io/spring-boot/index.html" 
}

def clean_html(html_content):
    soup = Soup(html_content, "html.parser")
    # Remove scripts, styles, and navbars to keep only content
    for element in soup(["script", "style", "nav", "footer", "header"]):
        element.decompose()
    return soup.get_text(separator=" ", strip=True)

async def crawl_and_index():
    splitter = RecursiveCharacterTextSplitter(chunk_size=1200, chunk_overlap=150)
    
    for name, url in DOCS_SOURCES.items():
        print(f"🌐 Crawling {name}...")
        
        # Load data (Max depth 2 to keep it manageable for a demo)
        loader = RecursiveUrlLoader(
            url=url, 
            max_depth=2, 
            extractor=clean_html
        )
        docs = loader.load()
        
        # Add metadata for filtering later
        for doc in docs:
            doc.metadata["library"] = name
            
        chunks = splitter.split_documents(docs)
        save_to_db(chunks)

if __name__ == "__main__":
    asyncio.run(crawl_and_index())