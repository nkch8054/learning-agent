// apps/vscode-extension/src/extension.ts
import * as vscode from 'vscode';
import { NexusWebviewPanel } from './providers/webviewPanel';
import { ApiCache } from './services/apiCache';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('nexus.analyzeCode', async () => {
            ApiCache.analyzeInBackground();
        })
    );

    // 3. Command to open Webview
    context.subscriptions.push(
        vscode.commands.registerCommand('nexus.showLesson', (analysis) => {
            NexusWebviewPanel.render(context.extensionUri, analysis);
        })
    );
}