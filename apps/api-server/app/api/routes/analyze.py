from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.agent import get_docs_analysis
from app.core.rag_engine import match_code_to_docs
import time

router = APIRouter()

class CodeAnalysisRequest(BaseModel):
    code: str
    language: str

@router.post("/analyze")
async def analyze_code(request: CodeAnalysisRequest):
    try:

        # Match user code to our Vector DB
        docs = match_code_to_docs(request.code, library_filter=request.language)

        # get analysis report
        analysis_result = get_docs_analysis(docs, request.code)
            
        return analysis_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))