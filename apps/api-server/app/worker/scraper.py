import asyncio
import uuid
from langchain_community.document_loaders import RecursiveUrlLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.db.vector_store import save_to_db
from bs4 import BeautifulSoup as Soup
from langchain_classic.schema import Document

# Config for the 5 libraries
DOCS_SOURCES = [
#    {"language": "javascript", "framework": "react", "url": "https://react.dev/reference/react"},
     {"language": "javascript", "framework": "nodejs", "url": "https://nodejs.org/api/"},
#    {"language": "typescript", "url": "https://www.typescriptlang.org/docs/"},
#    {"language": "javascript", "framework": "angular", "url": "https://angular.dev/"},
#    {"language": "javascript", "framework": "angular","library":"ngrx", "url": "https://ngrx.io/"},
#    {"language": "javascript", "framework": "angular","library":"rxjs", "url": "https://rxjs.dev/"},
#    {"language": "javascript", "url": "https://developer.mozilla.org/en-US/"},

#     {"language": "golang", "url": "https://pkg.go.dev/std"},
#     {"language": "golang", "framework": "gin", "url": "https://gin-gonic.com/docs/"},
#     {"language": "golang", "framework": "echo", "url": "https://echo.labstack.com/guide"},

#     {"language": "java", "framework": "spring", "url": "https://docs.spring.io/spring-boot/index.html"},
#     {"language": "java", "framework": "hibernate", "url": "https://hibernate.org/orm/documentation/"},
#     {"language": "java", "framework": "micronaut", "url": "https://docs.micronaut.io/latest/guide/index.html"},

#     {"language": "python", "url": "https://docs.python.org/3/"},
#     {"language": "python", "framework": "django", "url": "https://docs.djangoproject.com/en/stable/"},
#     {"language": "python", "framework": "fastapi", "url": "https://fastapi.tiangolo.com/"},
]
    
import asyncio
import aiohttp
import logging
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urldefrag
from collections import deque
from tenacity import retry, stop_after_attempt, wait_exponential

# ---------------- CONFIG ---------------- #
MAX_DEPTH = 2
CONCURRENCY = 5
REQUEST_TIMEOUT = 10
CHUNK_SIZE = 1200
CHUNK_OVERLAP = 150

logging.basicConfig(level=logging.INFO)

# ---------------- CLEAN HTML ---------------- #
def clean_html(html: str) -> str:
    soup = BeautifulSoup(html, "html.parser")

    for tag in soup(["script", "style", "nav", "footer", "header", "aside"]):
        tag.decompose()

    text = soup.get_text(separator=" ", strip=True)
    return " ".join(text.split())


# ---------------- FETCH WITH RETRY ---------------- #
@retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=5))
async def fetch(session, url):
    async with session.get(url, timeout=REQUEST_TIMEOUT) as response:
        if response.status != 200:
            raise Exception(f"Failed {url} with {response.status}")
        return await response.text()


# ---------------- EXTRACT LINKS ---------------- #
def extract_links(base_url, html):
    soup = BeautifulSoup(html, "html.parser")
    links = set()

    for a in soup.find_all("a", href=True):
        href = urljoin(base_url, a["href"])
        href, _ = urldefrag(href)  # remove #fragment
        if href.startswith("http"):
            links.add(href)

    return links


# ---------------- CRAWLER ---------------- #
async def crawl_site(start_url):
    visited = set()
    queue = deque([(start_url, 0)])
    results = []

    connector = aiohttp.TCPConnector(limit=CONCURRENCY)
    timeout = aiohttp.ClientTimeout(total=REQUEST_TIMEOUT)

    async with aiohttp.ClientSession(connector=connector, timeout=timeout) as session:

        while queue:
            url, depth = queue.popleft()

            if url in visited or depth > MAX_DEPTH:
                continue

            visited.add(url)

            try:
                logging.info(f"🌐 Crawling: {url}")
                html = await fetch(session, url)

                text = clean_html(html)

                if text:
                    results.append({
                        "url": url,
                        "content": text
                    })

                # extract new links
                for link in extract_links(url, html):
                    if link not in visited:
                        queue.append((link, depth + 1))

            except Exception as e:
                logging.error(f"❌ Error crawling {url}: {e}")

    return results


# ---------------- PIPELINE ---------------- #
async def crawl_and_index():
    all_chunks = []
    splitter = RecursiveCharacterTextSplitter(chunk_size=1200, chunk_overlap=150)

    for source in DOCS_SOURCES:
    
        print(f"🚀 Crawling {source['url']}")

        pages = await crawl_site(source["url"])

        for page in pages:
            chunks = splitter.split_text(page["content"])

            for chunk in chunks:
                all_chunks.append(
                    Document(
                        page_content=chunk,
                        metadata={
                            "source": page["url"],
                            "language": source.get("language"),
                            "framework": source.get("framework"),
                            "library": source.get("library"),
                            "id": str(uuid.uuid4()) 
                        }
                    )
                )

    save_to_db(all_chunks)
    logging.info("✅ Indexing completed")


# ---------------- ENTRY ---------------- #
if __name__ == "__main__":
    asyncio.run(crawl_and_index())