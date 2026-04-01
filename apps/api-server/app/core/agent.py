from typing import TypedDict, Optional
from langchain_cohere import ChatCohere

# Define the response interface
class AnalysisResponse(TypedDict):
    found: bool
    matches: Optional[str]
    suggestion: Optional[str]
    link: Optional[str]


def get_docs_analysis(relevant_docs: list, user_code: str) -> AnalysisResponse:

    # 4. Handle "Not Found" case
    if not relevant_docs:
        return {
            "found": False,
            "matches": None,
            "suggestion": "No specific documentation found for this code snippet.",
            "link": None
        }

    # 5. Synthesize the Suggestion (Using an LLM pass)
    # We take the top match to build the response
    top_match = relevant_docs[0]
    
    # Use an LLM to generate the "suggestion" based on the match
    # You can use Voyage via LiteLLM or OpenAI here
    llm = ChatCohere(model="command-a-03-2025") 
    
    prompt = f"""
    User Code: {user_code}
    Documentation Found: {top_match.page_content}
    
    Based on the docs, provide a short 1-sentence suggestion to improve the code.
    """

    try:
       response = llm.invoke(prompt)
       print(response)
    except Exception as e:
        print("ERROR:", type(e), e)

    suggestion_text = response.content if hasattr(response, "content") else str(response)

    # 6. Construct final Response to match AnalysisResponse interface
    return {
        "found": True,
        "matches": top_match.page_content[:200] + "...", # Summary of the doc
        "suggestion": suggestion_text,
        "link": top_match.metadata.get("source") or top_match.metadata.get("url")
    }
