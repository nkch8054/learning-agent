import * as fs from 'fs';
import * as vscode from 'vscode';

import { AnalysisResponse } from '../model/analysis-response';

export class NexusWebviewPanel {
    public static currentPanel: NexusWebviewPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];
    private readonly _extensionUri: vscode.Uri;

    public static render(extensionUri: vscode.Uri, data: AnalysisResponse) {
        if (NexusWebviewPanel.currentPanel) {
            NexusWebviewPanel.currentPanel._panel.reveal(vscode.ViewColumn.Two);
            NexusWebviewPanel.currentPanel._update(data);
        } else {
            const panel = vscode.window.createWebviewPanel(
                'Nexus Learning',
                'Nexus Learning: Lesson',
                vscode.ViewColumn.Two,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true,
                }
            );

            NexusWebviewPanel.currentPanel = new NexusWebviewPanel(panel, extensionUri, data);
        }
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, data: AnalysisResponse) {
        this._panel = panel;
        this._extensionUri = extensionUri;
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._update(data);
    }

    private _update(data: AnalysisResponse) {
        this._panel.webview.html = this._getHtmlContent(this._panel.webview, this._extensionUri, data);

        this._panel.webview.postMessage({
            type: "init",
            payload: data
        });

        // Handle messages from the webview (like clicking the "Open Link" button)
        this._panel.webview.onDidReceiveMessage(async (message) => {
            if (message.command === 'openInternalBrowser') {
                try {
                    // Ensure the URL is a valid VS Code URI object
                    const uri = vscode.Uri.parse(message.url);

                    // Attempt to open in VS Code's built-in "Simple Browser"
                    await vscode.commands.executeCommand('simpleBrowser.show', uri.toString());
                } catch (error) {
                    console.error("Failed to open internal browser, falling back to external", error);
                    // Fallback: Open in Chrome/Safari/Edge if internal fails
                    vscode.env.openExternal(vscode.Uri.parse(message.url));
                }
            }
        });
    }



    private _getHtmlContent(webview: vscode.Webview, extensionUri: vscode.Uri, data: AnalysisResponse): string {
        const htmlUri = webview.asWebviewUri(
            vscode.Uri.joinPath(extensionUri, 'src/media', 'index.html')
        );

        const htmlContent = fs.readFileSync(htmlUri.fsPath, 'utf8');

        const cssUri = webview.asWebviewUri(
            vscode.Uri.joinPath(extensionUri, 'src/media', 'styles.css')
        );

        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(extensionUri, 'src/media', 'script.js')
        );

        return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="Content-Security-Policy"
            content="default-src 'none';
                     style-src ${webview.cspSource};
                     script-src ${webview.cspSource};">

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link href="${cssUri}" rel="stylesheet" />
        <title>Nexus Learning</title>
    </head>
    <body>
        ${htmlContent}

        <script src="${scriptUri}"></script>
    </body>
    </html>
    `;
    }

    public dispose() {
        NexusWebviewPanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) x.dispose();
        }
    }
}