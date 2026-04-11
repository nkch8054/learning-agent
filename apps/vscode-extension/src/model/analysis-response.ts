export interface AnalysisResponse {
    found: boolean;
    matches?: string;
    suggestion?: string;
    why: string;
    practice_task: string;
    user_code: string;
    category: string;
    confidence: string;
    link?: string;
    issues: string[];
    explanation: string[];
}