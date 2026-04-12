# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
|------|----------|
| `detect_changes` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context` | Need source snippets for review — token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.

---

## Project Overview

**Quiz Application with Version Control Tracking** — a frontend-only web app that evolves through 5 versions to demonstrate Git workflows. No backend, no build tooling; open `index.html` directly in a browser.

**Tech stack**: HTML, CSS, vanilla JavaScript, Browser LocalStorage

**Testing**: Manual browser testing — open `index.html`, exercise the quiz flow, verify LocalStorage state via DevTools.

---

## Architecture

Single-page app under `quiz-app/`:

```
quiz-app/
├── index.html       # UI structure
├── style.css        # Styles
├── script.js        # All application logic
└── questions.json   # Question data (added in v3.0)
```

`script.js` is the sole logic layer — it reads questions (inline in v1–v2, from `questions.json` in v3+), manages quiz state, handles timer countdown, reads/writes LocalStorage for history, and renders the leaderboard.

---

## Feature Versions

| Tag | Branch | Key addition |
|-----|--------|--------------|
| v1.0 | `main` | Static questions, multiple-choice, score calculation |
| v2.0 | `feature/ui` + `feature/timer` | Improved UI, per-question timer |
| v3.0 | `feature/dynamic-questions` | `questions.json`, randomized order |
| v4.0 | `feature/history` | LocalStorage score persistence, past-attempts display |
| v5.0 | `feature/advanced` | Leaderboard, difficulty levels/categories |

---

## Git Strategy

- `main` — stable, tagged releases only
- `feature/<name>` — one branch per feature; merge into `main` when complete
- Tag each release: `git tag v1.0`, `git tag v2.0`, etc.
- Commit messages should describe *what changed and why* (e.g. `add per-question countdown timer`)
