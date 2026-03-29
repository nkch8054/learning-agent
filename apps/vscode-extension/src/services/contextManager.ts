import * as vscode from 'vscode';

export function getActiveCodeSnippet(): string {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return "";
    
    // For MVP: Get the current line. 
    // Evolution: Get the whole function block.
    const selection = editor.selection;
    const line = editor.document.lineAt(selection.active.line);
    return line.text;
}