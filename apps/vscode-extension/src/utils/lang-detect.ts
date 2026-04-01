import * as vscode from 'vscode';

export type SupportedLanguage = 'angular' | 'reactjs' | 'nodejs' | 'typescript' | 'javascript' | 'java_spring' | 'golang' | 'unknown';

export function detectLanguage(document: vscode.TextDocument): SupportedLanguage {
    const ext = document.fileName.split('.').pop()?.toLowerCase();
    const content = document.getText(new vscode.Range(0, 0, 80, 0)); // Read slightly more for Node signatures

    // Node.js specific signatures
    const isNode = content.includes("require('") || 
                   content.includes("process.") || 
                   content.includes("module.exports") ||
                   content.includes("from 'fs'") ||
                   content.includes("from 'path'");

    switch (ext) {
        case 'java': return 'java_spring';
        case 'go': return 'golang';
        case 'js':
        case 'jsx':
            if (content.includes('import React') || content.includes('from "react"')) return 'reactjs';
            if (isNode) return 'nodejs';
            return 'javascript';
        case 'ts':
        case 'tsx':
            if (content.includes('@Component') || content.includes('@angular')) return 'angular';
            if (content.includes('import React') || content.includes('from "react"')) return 'reactjs';
            if (isNode) return 'nodejs';
            return 'typescript';
        default:
            return 'unknown';
    }
}