import * as vscode from 'vscode';

export class SanitizedCodeExtractor {

    public static sanitize(code: string): string {
        return code
            // 1. Remove Comments
            .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '')
            // 2. Replace String Literals with <STR>
            .replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, '"<STR>"')
            // 3. Replace Variable/Function Names (Optional but safer)
            // This regex targets common assignment patterns to mask variable names
            .replace(/\b(const|let|var)\s+([a-zA-Z0-9_]+)/g, '$1 identifier')
            // 4. Collapse whitespace
            .replace(/\s+/g, ' ')
            .trim();
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