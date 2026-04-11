# 🚀 Nexus: Your Just-in-Time Learning Sidekick

**Nexus** is an AI-powered Learning Agent that audits your code in real-time. It identifies "Learning Moments"—outdated patterns, performance bottlenecks, or security risks—and provides interactive 15-second lessons exactly where you are working.

Instead of generic linting, Nexus uses deep context to teach you the **"Why"** behind modern code standards.

---

## ✨ Key Features

### 🔍 Smart Background Auditing
As you type, Nexus performs a background audit of your active code block. Within 3 seconds, it highlights outdated patterns with a **subtle blue squiggle**, ensuring you stay focused while the AI "thinks."

### 🤖 Context-Aware "Matches"
When you open a Nexus lesson, the exact code you wrote is displayed at the top. This provides immediate context, showing you exactly which part of your project the advice applies to.

### 📝 Detailed Issue Breakdowns
No more vague "this is bad" messages. Nexus provides a structured list of specific technical issues, each with its own bulleted explanation of the risks and benefits.

### 🎯 Interactive Practice Tasks
Every lesson concludes with a specific "Practice Task"—a hands-on mission to refactor your code and reinforce the new concept.

### 📖 Multi-Resource Learning
Nexus provides multiple curated links for every issue—ranging from 15-second visual demos to official documentation (MDN, React.dev, etc.)—all viewable in the built-in VS Code browser.

---

## 🚀 How to Use

### 1. The Automatic Audit (Background)
Simply write your code. 3 seconds after you stop typing, Nexus will **underline** problematic patterns (like `useEffect` fetch or `time.time()` calls) with a blue information squiggle.

### 2. The Manual Audit (Right-Click)
Want a second opinion on a specific block of code? 
- **Highlight** the code.
- **Right-click** -> **"Nexus: Analyze Code"**.
- A loading progress bar will appear while the AI audits your code.

---

## 🛠 Supported Environments

Nexus is a polyglot agent optimized for:
- **Frontend:** React (Suspense, use() hook), Angular (Signals, RxJS)
- **Backend:** Node.js (Async patterns), Go (Error wrapping, Goroutines), Java (Streams)
- **Data/Logic:** Python (Performance, Monotonic timers)

---

## 🔒 Privacy & Security

**Nexus uses Local Sanitization.** 
Before any code is sent to the cloud for analysis, the extension local-processes your snippet to:
- Mask variable names (e.g., `const userData` becomes `const identifier`).
- Strip string literals and secrets.
- Remove comments.
Only the **structural pattern** of your code is analyzed, keeping your proprietary logic safe.

---

## ⚙️ Extension Settings

*   `nexus.apiKey`: Your Cohere API Key for analysis.
*   `nexus.enableBackgroundAudit`: Toggle automatic blue squiggles.
*   `nexus.debounceTime`: Milliseconds to wait before starting an audit (Default: `800ms`).

---

## 📦 Requirements

*   A **Cohere API Key** (Get one for free at [cohere.com](https://cohere.com)).
*   VS Code version 1.75.0+.

---

## 📝 Release Notes

### 1.1.0
- **New UI:** Shifted to Diagnostic Squiggles for better visibility.
- **Improved Context:** "Matches" now display at the top of the learning panel.
- **Multi-Reference:** Support for multiple documentation links per lesson.
- **Copilot Auditor:** Automatic auditing of multi-line blocks inserted by GitHub Copilot.

---

**Happy Coding with Nexus!**