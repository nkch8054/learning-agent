import * as vscode from 'vscode';
import { AnalysisResponse } from '../model/analysis-response';
import { ContextManager } from './contextManager';
import { detectLanguage } from '../utils/lang-detect';
import { checkCodeModernity } from './api';

export class ApiCache {
    private static codeCache = new Map<string, AnalysisResponse>();

    public static async analyzeInBackground() {

        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        // 1. Get the Selected Text
        const selection = editor.selection;
        const rawSnippet = editor.document.getText(selection).trim();

        // 🔥 USE CONTEXT MANAGER: Sanitize it before sending to LLM
        const sanitizedText = ContextManager.sanitize(rawSnippet);

        if (sanitizedText.length < 10) {
            vscode.window.showWarningMessage("Please select a larger block of code.")
            return;
        }

        // 1. Check Code Cache (Instant)
        if (this.codeCache.has(sanitizedText)) {
            vscode.commands.executeCommand('nexus.showLesson', this.codeCache.get(sanitizedText));
            return;
        }

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Nexus is analyzing your code...",
            cancellable: false
        }, async (progress) => {
            const lang = detectLanguage(editor.document);
            const analysis = await checkCodeModernity(sanitizedText, lang);

            try {
                if (analysis && analysis.found) {

                    // 3. Store in caches
                    this.codeCache.set(sanitizedText, analysis);

                    vscode.commands.executeCommand('nexus.showLesson', analysis);
                } else {
                    vscode.window.showInformationMessage("Nexus found no major issues in this selection.");
                }
            } catch (err) {
                vscode.window.showErrorMessage("Analysis failed. Please check your connection.");
            }
        });

    }

    public static get(code: string): AnalysisResponse | undefined {
        return this.codeCache.get(code);
    }

    public static clear() {
        this.codeCache.clear();
    }
}