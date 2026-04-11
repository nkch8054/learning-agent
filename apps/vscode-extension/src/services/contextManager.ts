
import * as vscode from 'vscode';

export class ContextManager {

    /**
     * Grabs the logical block surrounding a position
     */
    public static getActiveBlock(document: vscode.TextDocument, range: vscode.Range): string {
        // 1. If it's a multi-line insertion (Copilot/Paste), return that text directly
        if (!range.isSingleLine) {
            return document.getText(range).trim();
        }

        // 2. If it's a single line, expand to find the surrounding "Block" (e.g., the function)
        const startLine = Math.max(0, range.start.line - 5);
        const endLine = Math.min(document.lineCount - 1, range.start.line + 5);

        return document.getText(new vscode.Range(startLine, 0, endLine, 0)).trim();
    }

    public static sanitize(code: string): string {
        return code
            .replace(/\/\/.*/g, '') // Remove comments
            .replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, '"<STR>"') // Mask strings
            .replace(/\b(const|let|var)\s+([a-zA-Z0-9_]+)/g, '$1 identifier') // Mask vars
            .trim();

        // return code
        //     // 1. Remove Comments
        //     .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '')
        //     // 2. Replace String Literals with <STR>
        //     .replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, '"<STR>"')
        //     // 3. Replace Variable/Function Names (Optional but safer)
        //     // This regex targets common assignment patterns to mask variable names
        //     .replace(/\b(const|let|var)\s+([a-zA-Z0-9_]+)/g, '$1 identifier')
        //     // 4. Collapse whitespace
        //     .replace(/\s+/g, ' ')
        //     .trim();
    }

    /**
     * Local Trigger Detection (The "Tiny Model" or Regex logic)
     */
    public static shouldTrigger(context: string): boolean {
        const triggers = [
            /useEffect\s*\(\s*\(\s*\)\s*=>\s*\{\s*fetch/, // React fetch pattern
            /useState\s*\(\s*(\{\}|\[\])\s*\)/,           // Complex state pattern
            /\.map\s*\(/                                  // List rendering pattern
        ];
        return triggers.some(regex => regex.test(context));
    }
}