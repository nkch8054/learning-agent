import axios from 'axios';
import { AnalysisResponse } from '../model/analysis-response';

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