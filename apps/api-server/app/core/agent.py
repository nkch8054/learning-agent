from typing import TypedDict, Optional
from langchain_cohere import ChatCohere
from app.core.prompt_templates import build_learning_prompt
import json
import re

# Define the response interface
class AnalysisResponse(TypedDict):
    found: bool
    matches: Optional[str]
    suggestion: Optional[str]
    why: Optional[str]
    category: Optional[str]
    practice_task:  Optional[str]
    confidence: Optional[str]
    link: Optional[str]


def get_docs_analysis(relevant_docs: list, user_code: str) -> AnalysisResponse:

    # 4. Handle "Not Found" case
    if not relevant_docs:
        return {
            "found": False,
            "matches": None,
            "suggestion": "No specific documentation found for this code snippet.",
            "why": None,
            "category": None,
            "practice_task":None,
            "confidence" : None,
            "link": None
        }

    # 5. Synthesize the Suggestion (Using an LLM pass)
    # We take the top match to build the response
    docs_context = "\n\n".join([
        f"Doc {i+1}:\n{doc.page_content}"
        for i, doc in enumerate(relevant_docs[:4])
        ])
    
    # Use an LLM to generate the "suggestion" based on the match
    # You can use Voyage via LiteLLM or OpenAI here
    llm = ChatCohere(model="command-a-03-2025", temperature=0) 

    prompt = build_learning_prompt(
        user_code=user_code,
        docs_context=docs_context,
        )


    try:
        response = llm.invoke(prompt)
        raw_output = response.content if hasattr(response, "content") else str(response)
        # Clean common LLM formatting issues
        cleaned = raw_output.strip().strip("```json").strip("```")
        match = re.search(r"\{.*\}", raw_output, re.DOTALL)
        if not match:
             raise ValueError("No JSON found in response")
        parsed = json.loads(match.group(0))
        parsed = validate(parsed)
    except Exception as e:
        print("ERROR:", type(e), e)
        return {
            "suggestion": "Unable to generate suggestion",
            "why": "",
            "practice_task": "",
            "category": "best_practice",
            "confidence": "low"
            }
        
    return {
        "found": True,
        "matches": parsed["matched_code"],
        "suggestion": parsed["suggestion"],
        "explanation": parsed["explanation"],
        "issues": parsed["issues"],
        "why": parsed["why"],
        "practice_task": parsed["practice_task"],
        "category": parsed["category"],
        "confidence": parsed["level"],
        "link": parsed["link"]
        }

def validate(parsed):
    required_keys = ["suggestion", "why", "practice_task", "category", "level"]
    for key in required_keys:
        if key not in parsed:
            raise ValueError(f"Missing key: {key}")
    return parsed