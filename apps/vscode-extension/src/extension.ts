// apps/vscode-extension/src/extension.ts
import * as vscode from 'vscode';
import { AnalysisResponse } from './model/analysis-response';
import { NexusWebviewPanel } from './providers/webviewPanel';
import { NexusInlineProvider } from './providers/codeAction';

export function activate(context: vscode.ExtensionContext) {
    // Define the languages we support
    const selectors = [
        'javascript', 'typescript', 'javascriptreact', 'typescriptreact', 
        'java', 'go', 'nodejs', 'python'
    ];

    // 1. Register the "Ghost Text" Provider
    context.subscriptions.push(
        vscode.languages.registerInlineCompletionItemProvider(
            selectors, 
            new NexusInlineProvider()
        )
    );

    // 2. Register Command to open the Webview
    context.subscriptions.push(
        vscode.commands.registerCommand('nexusLearning.showLesson', () => {
            
            // Read from the static property in the other file
            const data = NexusInlineProvider.lastAnalysis;

            if (data && data.found) {
                // Open your Webview
                NexusWebviewPanel.render(context.extensionUri, data );
            } else {
                vscode.window.showInformationMessage("Move cursor to a line with a 💡 tip first.");
            }
        })
    );
}

// This method is called when your extension is deactivated
export function deactivate() { }