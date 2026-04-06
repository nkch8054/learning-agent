import * as vscode from 'vscode';
import { AnalysisResponse } from '../model/analysis-response';

export class NexusWebviewPanel {
    public static currentPanel: NexusWebviewPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];

    public static render(extensionUri: vscode.Uri, data: AnalysisResponse) {
        if (NexusWebviewPanel.currentPanel) {
            NexusWebviewPanel.currentPanel._panel.reveal(vscode.ViewColumn.Two);
            NexusWebviewPanel.currentPanel._update(data);
        } else {
            const panel = vscode.window.createWebviewPanel(
                'Nexus Learning',
                'Nexus Learning: Lesson',
                vscode.ViewColumn.Two,
                { enableScripts: true }
            );

            NexusWebviewPanel.currentPanel = new NexusWebviewPanel(panel, data);
        }
    }

    private constructor(panel: vscode.WebviewPanel, data: AnalysisResponse) {
        this._panel = panel;
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._update(data);
    }

    private _update(data: AnalysisResponse) {
        this._panel.webview.html = this._getHtmlContent(data);

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

    private _getHtmlContent(data: any): string {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                :root {
                    --container-padding: 20px;
                    --card-bg: var(--vscode-sideBar-background);
                    --border: var(--vscode-widget-border);
                }
                body { 
                    font-family: var(--vscode-font-family); 
                    padding: var(--container-padding); 
                    color: var(--vscode-foreground); 
                    background-color: var(--vscode-editor-background);
                }
                .label { 
                    font-size: 10px; 
                    font-weight: bold; 
                    text-transform: uppercase; 
                    letter-spacing: 1px;
                    color: var(--vscode-descriptionForeground);
                    margin-bottom: 8px;
                }
                .code-block {
                    background: #00000033; /* Semi-transparent black */
                    border-radius: 6px;
                    padding: 12px;
                    margin-bottom: 20px;
                    border: 1px solid var(--vscode-panel-border);
                    overflow-x: auto;
                }
                pre { 
                    margin: 0; 
                    font-family: var(--vscode-editor-font-family); 
                    font-size: var(--vscode-editor-font-size);
                    color: #d4d4d4; /* Standard VS Code text color */
                    white-space: pre-wrap;
                }
                .suggestion-box {
                    line-height: 1.5;
                    font-size: 14px;
                    margin-bottom: 24px;
                }
                .btn { 
                    background: var(--vscode-button-background); 
                    color: var(--vscode-button-foreground);
                    border: none; 
                    padding: 8px 14px; 
                    border-radius: 2px; 
                    cursor: pointer;
                    font-weight: 600;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }
                .btn:hover { background: var(--vscode-button-hoverBackground); }
                .footer {
                    margin-top: 40px;
                    border-top: 1px solid var(--vscode-panel-border);
                    padding-top: 10px;
                    font-size: 11px;
                    color: var(--vscode-descriptionForeground);
                }
            </style>
        </head>
        <body>
            <div class="label">Matched Pattern</div>
            <div class="code-block">
                <pre><code>${this.formatCode(data.matches)}</code></pre>
            </div>
            
            <div class="label">Suggested Improvement</div>
            <div class="suggestion-box">
                ${data.suggestion}
            </div>
            
            <button class="btn" onclick="openLink('${data.link}')">
                <span>Learn Why</span>
                <span>↗</span>
            </button>

            <div class="footer">
                Nexus Learning Agent • Context: Level 2 (Active Line)
            </div>

            <script>
                const vscode = acquireVsCodeApi();
                function openLink(url) {
                    vscode.postMessage({ command: 'openInternalBrowser', url: url });
                }
            </script>
        </body>
        </html>
    `;
    }

    // Clean up the code snippet so it doesn't look like gibberish
    private formatCode(code: string): string {
        if (!code) return "";
        return code
            .replace(/;/g, ';\n') // Add line breaks after semicolons
            .replace(/{/g, ' {\n  ') // Add indentation after brackets
            .replace(/}/g, '\n}')    // Add line break before closing brackets
            .trim();
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