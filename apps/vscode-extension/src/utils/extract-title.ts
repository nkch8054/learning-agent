export function extractGhostText(suggestion: string | undefined, limit: number = 65): string {
    if (!suggestion) return `// 💡 Tip: To improve code`;

    let text = suggestion.trim();

    // 2. If it's under the limit, return as is
    if (text.length <= limit) {
        return `// 💡 Tip: ${text}`;
    }

    // 3. Truncate and add ellipsis (...)
    return `// 💡 Tip: ${text.substring(0, limit - 3)}...`;
}