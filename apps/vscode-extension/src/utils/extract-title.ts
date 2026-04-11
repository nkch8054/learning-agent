export function extractGhostText(suggestion: string | undefined, limit: number = 65): string {
    if (!suggestion) return `Nexus: To improve code`;

    let text = suggestion.trim();

    // 2. If it's under the limit, return as is
    if (text.length <= limit) {
        return `Nexus: ${text}`;
    }

    // 3. Truncate and add ellipsis (...)
    return `Nexus: ${text.substring(0, limit - 3)}...`;
}