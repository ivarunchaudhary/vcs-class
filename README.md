# Quiz App — Git Version Control Demo

A frontend-only quiz application that evolves through 5 versions to demonstrate Git workflows, branching strategies, and version control concepts.

## Tech Stack

- HTML, CSS, Vanilla JavaScript
- Browser LocalStorage (no backend)
- No build tooling — open `index.html` directly in a browser

## Getting Started

1. Clone the repository
2. Open `quiz-app/index.html` in your browser
3. No installation or build step required

## Project Structure

```
quiz-app/
├── index.html        # Quiz UI
├── style.css         # Quiz styles
├── script.js         # All application logic
├── questions.json    # Question data
├── landing.html      # Landing page
├── landing.css       # Landing page styles
└── landing.js        # Landing page logic
```

## Feature Versions

| Version | Branch | Features |
|---------|--------|----------|
| v1.0 | `main` | Static questions, multiple-choice, score calculation |
| v2.0 | `feature/ui` + `feature/timer` | Improved UI, per-question countdown timer |
| v3.0 | `feature/dynamic-questions` | External `questions.json`, randomized question order |
| v4.0 | `feature/history` | LocalStorage score persistence, past attempts display |
| v5.0 | `feature/advanced` | Leaderboard, difficulty levels, and categories |

## Git Strategy

- `main` — stable, tagged releases only
- `feature/<name>` — one branch per feature, merged into `main` when complete
- Each release is tagged: `v1.0`, `v2.0`, `v3.0`, `v4.0`, `v5.0`

## Testing

Manual browser testing — open `index.html`, exercise the quiz flow, and verify LocalStorage state via DevTools (Application > Local Storage).
