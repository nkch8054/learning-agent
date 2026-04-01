// apps/vscode-extension/src/extension.ts
import * as vscode from 'vscode';
import { getActiveCodeSnippet } from './services/contextManager';
import { checkCodeModernity } from './services/api';
import {  detectLanguage } from './utils/lang-detect';

export function activate(context: vscode.ExtensionContext) {
    let 
    timeout: NodeJS.Timeout | undefined;

    // Listen for text changes
    const onType = vscode.workspace.onDidChangeTextDocument(async (event) => {
        if (timeout) clearTimeout(timeout);

        // Debounce: Wait 2 seconds after typing stops to analyze
        timeout = setTimeout(async () => {
            const code = getActiveCodeSnippet();
            const lang = detectLanguage(event.document);
            if (lang && code.length > 5) {
                const result = await checkCodeModernity(code, lang);
                
                if (result?.found) {
                    vscode.window.showInformationMessage(
                        `💡 ${result.suggestion}`,
                        "Learn Why", "Dismiss"
                    ).then(selection => {
                        if (selection === "Learn Why") {
                            vscode.env.openExternal(vscode.Uri.parse(result.link!));
                        }
                    });
                }
            }
        }, 2000);
    });

    context.subscriptions.push(onType);
}

// This method is called when your extension is deactivated
export function deactivate() {}