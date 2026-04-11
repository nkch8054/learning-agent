const vscode = acquireVsCodeApi();
let globalData = null;

// Format code
function formatCode(code) {
    if (!code) return "";
    return code
        .replace(/;/g, ';\n')
        .replace(/{/g, ' {\n  ')
        .replace(/}/g, '\n}');
}

window.addEventListener("message", (event) => {
    const message = event.data;

    if (message.type === "init") {

        globalData = message.payload;

        // ✅ CLEAR FIRST
        document.getElementById("analysis").innerHTML = "";
        document.getElementById("issues").innerHTML = "";
        document.getElementById("badges").innerHTML = "";

        // Inject Code
        document.getElementById("code").textContent = formatCode(globalData.matches);

        // Analysis
        const analysisDiv = document.getElementById("analysis");
        globalData.explanation.forEach(exp => {
            const el = document.createElement("ul");
            el.innerHTML = `<li>${exp}</li>`;
            analysisDiv.appendChild(el);
        });

        // Issues
        const issuesDiv = document.getElementById("issues");
        globalData.issues.forEach(issue => {
            const el = document.createElement("div");
            el.textContent = "📍 " + issue;
            issuesDiv.appendChild(el);
        });

        // Suggestion
        document.getElementById("suggestion").textContent = globalData.suggestion;
        document.getElementById("why").textContent = "💡 " + (globalData.why || "");

        // Badges
        const badgeDiv = document.getElementById("badges");
        badgeDiv.innerHTML = `
        <span class="badge">${globalData.category}</span>
        <span class="badge">${globalData.confidence}</span>
        `;

        // Practice
        if (globalData.practice_task) {
            document.getElementById("practiceContainer").innerHTML = `
            <div class="section card">
             <div class="label">Practice</div>
             <div>🧪 ${globalData.practice_task}</div>
            </div>
            `;
        }

        // Button
        document.getElementById("learnBtn").addEventListener("click", () => {
            vscode.postMessage({
                command: "openInternalBrowser",
                url: globalData.link[0]
            });
        });
    }
});