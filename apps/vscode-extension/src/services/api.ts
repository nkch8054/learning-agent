import axios from 'axios';
import { AnalysisResponse } from '../model/analysis-response';

export async function checkCodeModernity(code: string, language: string): Promise<AnalysisResponse | null> {
    try {
        const response = await axios.post('https://nexus-app-8.azurewebsites.net/', {
            code: code,
            language: language
        });
        return response.data;
    } catch (error) {
        console.error("Nexus API Error:", error);
        return null;
    }
}