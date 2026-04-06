import * as vscode from 'vscode';
import { checkCodeModernity } from '../services/api';
import { SanitizedCodeExtractor } from '../services/contextManager';
import { extractGhostText } from '../utils/extract-title';
import { AnalysisResponse } from '../model/analysis-response';

export class NexusInlineProvider implements vscode.InlineCompletionItemProvider {
    public static lastAnalysis: AnalysisResponse | null = null;
    private lastLineText = "";
    private lastRequestTime: number = 0;

    public async provideInlineCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        context: vscode.InlineCompletionContext,
        token: vscode.CancellationToken
    ): Promise<vscode.InlineCompletionList> {

        // 1. Capture the exact time this specific request started
        const startTime = Date.now();
        this.lastRequestTime = startTime;

        // 1. Get the current line content
        const lineText = document.lineAt(position.line).text.trim();

        // 3. YOUR LOGIC: Run the modernity check
        const sanitizedText = SanitizedCodeExtractor.sanitize(lineText);

        // 1. PERFORMANCE: Skip empty lines or if the text hasn't changed
        if (lineText.trim().length < 5 || sanitizedText === this.lastLineText) {
            NexusInlineProvider.lastAnalysis = null;
            return { items: [] };
        }

        // 2. DEBOUNCE: Wait 500ms. If the user types another key, 
        await new Promise(resolve => setTimeout(resolve, 500));

        // 4. THE STABILITY CHECK: 
        // If 'this.lastRequestTime' has changed, it means the user typed another key
        // during our 500ms wait. We must kill this old request.
        if (startTime !== this.lastRequestTime) {
            NexusInlineProvider.lastAnalysis = null;
            return { items: [] };
        }

        // 2. CHECK: If the user keeps typing, this token tells us to stop (Performance)
        if (token.isCancellationRequested) {
            NexusInlineProvider.lastAnalysis = null;
            return { items: [] }
        };
        const lang = document.languageId;

        // Call your existing checkCodeModernity function
        const analysis = await checkCodeModernity(sanitizedText, lang);

        if (analysis?.found) {
            this.lastLineText = sanitizedText;

            // 4. GHOST TEXT: This appears in gray after the cursor
            // We format it as a comment so it doesn't break the code if they press Tab
            const ghostText = `${extractGhostText(analysis.suggestion)} (Press alt+i to Learn)`;

            // 1. Use SnippetString for better compatibility
            const item = new vscode.InlineCompletionItem(new vscode.SnippetString(ghostText));

            // 2. CRITICAL: This stops VS Code from hiding the text while you type.
            // We set the filter text to the current word so it stays visible.
            const currentWordRange = document.getWordRangeAtPosition(position);
            item.filterText = document.getText(currentWordRange);

            // Set the range to the end of the line
            item.range = new vscode.Range(position, position);

            NexusInlineProvider.lastAnalysis = analysis;
            // it automatically opens the lesson!
            item.command = {
                command: 'nexusLearning.showLesson',
                title: 'Learn Why',
                arguments: [analysis]
            };

            return { items: [item] };
        }

        NexusInlineProvider.lastAnalysis = null;

        return { items: [] };
    }
}