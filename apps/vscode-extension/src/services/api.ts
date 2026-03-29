import axios from 'axios';

export interface AnalysisResponse {
    found: boolean;
    message?: string;
    suggestion?: string;
    link?: string;
}

export async function checkCodeModernity(code: string, language: string): Promise<AnalysisResponse | null> {
    try {
        const response = await axios.post('http://localhost:8000/analyze', {
            content: code,
            language: language
        });
        return response.data;
    } catch (error) {
        console.error("Situ API Error:", error);
        return null;
    }
}