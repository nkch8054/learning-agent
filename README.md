***

# Nexus: The Just-In-Time AI Learning Agent 🧠🚀

> **"The half-life of a skill used to be 10 years. Now, it’s 18 months."** 

Nexus is a "Micro-learning Agent" designed to solve the **Obsolescence Anxiety** of modern professionals. Instead of 10-hour courses, Nexus delivers 15-second interactive "nudges" directly inside your workflow (VS Code, Figma, Slack) to teach you the latest AI tools and library features while you work.

---

## 🌪 The Problem
Professionals are trapped in a **"Learning Paradox"**: 
1. Work demands 10 hours a day.
2. AI tools change every week.
3. There is zero "cognitive surplus" left to stay competitive.

## ✨ The Solution: "Learn While Doing"
Nexus sits silently in your IDE or design tool. It observes your patterns and suggests **AI-native alternatives** or **newly released features** only when they are relevant to your current task.

- **Zero Friction:** No videos to watch. No separate tabs.
- **Context-Aware:** It knows if you are using an outdated React hook or a manual CSS process.
- **Skill-Gap Analytics:** Gamifies your "Modernity Score" to keep you ahead of the curve.

---

## 🏗 Project Structure

This project is organized as a **Monorepo** to handle both the user-facing extensions and the centralized AI "Brain."

```text
nexus-monorepo/
├── apps/
│   ├── vscode-extension/      # Frontend: The "Observer" (TypeScript)
│   │   ├── src/
│   │   │   ├── extension.ts   # Main activation & event listeners
│   │   │   ├── providers/     # UI (Hovers, Code Actions, Webviews)
│   │   │   └── services/      # API Bridge to the Brain
│   │   └── package.json       # VS Code Manifest & Activation Events
│   │
│   └── api-server/            # Backend: The "Brain" (Python/FastAPI)
│       ├── app/
│       │   ├── main.py        # Entry point
│       │   ├── core/          # Agent logic & RAG Engine
│       │   ├── db/            # Vector Store (Pinecone) & User Progress
│       │   └── worker/        # Daily scrapers for tech changelogs
│       └── requirements.txt
│
├── packages/
│   └── shared/                # Shared TypeScript/JSON schemas for lessons
│
├── scripts/                   # Data ingestion pipelines
└── docker-compose.yml         # Local development environment
```

---

## 🛠 Tech Stack

### Frontend (The Observer)
- **Engine:** VS Code Extension API / Language Server Protocol (LSP).
- **Language:** TypeScript.
- **UI:** Webviews (React-based) for interactive sandboxes.

### Backend (The Brain)
- **Framework:** FastAPI (Python).
- **Orchestration:** LangGraph / LangChain (for Agentic reasoning).
- **LLMs:** 
    - **Claude 3.5 Sonnet:** For high-fidelity code reasoning and lesson synthesis.
    - **Phi-3 (Local):** For lightweight, privacy-preserving initial intent detection.
- **Vector Database:** Qdrant or Pinecone (to store the "Latest Tech" embeddings).

### Infrastructure
- **Deployment:** AWS Lambda / Modal for serverless AI inference.
- **Scrapers:** Playwright (for crawling official documentation and GitHub releases).

---

## 🚀 How It Works (The Nexus Loop)

1. **Observation:** The `vscode-extension` detects a 3-second pause in typing or the import of a specific library.
2. **Contextualization:** A sanitized snippet of the current code is sent to the `api-server`.
3. **Retrieval:** The `Brain` queries the Vector DB: *"Is there a more efficient AI-native method for this specific code pattern released in the last 6 months?"*
4. **Nudge:** If a match is found, a **Ghost Text** or **Lightbulb** appears in VS Code.
5. **Interactive Lesson:** Clicking the nudge opens a side-panel "Sandbox" where the user can test the new feature in 30 seconds.
6. **Mastery:** The user’s "Modernity Score" is updated in the dashboard.

---

## 📈 Roadmap

- [ ] **Phase 1 (MVP):** VS Code Extension for React & Tailwind (The "New vs. Old" engine).
- [ ] **Phase 2:** "Skill-Chain" Dashboard to track learning progress over time.
- [ ] **Phase 3:** Figma Plugin for Designers (AI-assisted UI patterns).
- [ ] **Phase 4:** Enterprise Edition (Allowing companies to upload internal docs for onboarding).

---

## 🤝 Contributing
Nexus is built for the community. If you are passionate about the future of education and human-AI collaboration, join us!

---

## 📄 License
MIT License - See [LICENSE](LICENSE) for details.

---
*Nexus: Stay relevant. One keystroke at a time.*