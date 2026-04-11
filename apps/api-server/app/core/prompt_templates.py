def build_learning_prompt(user_code: str, docs_context: str) -> str:
    prompt = f"""
You are a senior software engineer teaching a junior developer.

User Code:
{user_code}

Relevant Documentation:
{docs_context}

Your job:
1. Explain the code clearly using the documentation context
2. Identify issues or improvements
3. Suggest ONE best improvement
4. Give a small practice task

Return ONLY valid JSON:
{{
    "explanation": [
    "Explain what this block does in simple terms",
    "Break into logical steps using user code"
    ],
    "doc_connection": [
    "Connect code behavior to documentation (APIs, rules, best practices)",
    "Mention why the documentation is relevant"
    ],
    "issues": [
    "List real issues found in the code",
    "Empty array if none"
    ],
    "matched_code": "exact code snippet from user_code(what needs improvement)",
    "suggestion": "One best improvement (very practical)",
    "why": "Why this matters in real development",
    "practice_task": "Small exercise to improve skill",
    "category": "readability",
    "link": [
    "List of tutorial links, best practices, API references related to the code and improvement",
    ],
    "level": "beginner | intermediate | advanced"
    }}
    
    Rules:
    - Use documentation to justify explanation (no hallucination)
    - Be concise and practical
    - Do not repeat documentation blindly
    - Do not include anything outside JSON
"""
    return prompt