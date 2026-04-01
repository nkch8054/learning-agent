import axios from 'axios';

export interface AnalysisResponse {
    found: boolean;
    matches?: string;
    suggestion?: string;
    link?: string;
}

export async function checkCodeModernity(code: string, language: string): Promise<AnalysisResponse | null> {
    try {
        const response = await axios.post('http://localhost:8000/analyze', {
            code: code,
            language: language
        });
        return response.data;
    } catch (error) {
        console.error("Nexus API Error:", error);
        return null;
    }
}