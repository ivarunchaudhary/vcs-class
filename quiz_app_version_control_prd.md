# Product Requirements Document (PRD)

## 1. Project Title
Quiz Application with Version Control Tracking

---

## 2. Overview
This project is a web-based quiz application developed to demonstrate effective use of version control systems (Git). The application evolves through multiple versions, with each version introducing new features. The primary goal is to showcase historical tracking and controlled enhancement of features.

---

## 3. Objectives
- Build a functional quiz web application
- Demonstrate version control using Git
- Track feature evolution across versions
- Maintain clean commit history and branching strategy
- Implement historical tracking of user performance

---

## 4. Target Users
- Students
- Teachers/Evaluators

---

## 5. Scope
### In Scope
- Multiple-choice quiz system
- Score calculation
- UI improvements across versions
- Timer functionality
- Local storage for history tracking
- Git version tracking

### Out of Scope
- User authentication
- Backend/database systems
- Complex APIs

---

## 6. Tech Stack
- Frontend: HTML, CSS, JavaScript
- Version Control: Git & GitHub
- Storage: Browser LocalStorage

---

## 7. Features by Version

### Version 1.0 - Basic Quiz
- Static questions
- Multiple-choice answers
- Score calculation

### Version 2.0 - UI & Timer
- Improved UI design
- Timer per question

### Version 3.0 - Dynamic Questions
- Questions loaded from JSON
- Randomized question order

### Version 4.0 - History Tracking
- Store previous scores in LocalStorage
- Display past attempts

### Version 5.0 - Advanced Features
- Leaderboard
- Difficulty levels or categories

---

## 8. Functional Requirements
- Users should be able to start a quiz
- Users should select answers
- System should calculate score
- Timer should track time per question
- System should store past scores
- Users should view history of attempts

---

## 9. Non-Functional Requirements
- Simple and responsive UI
- Fast loading
- Easy navigation
- Clean and readable code

---

## 10. Git Version Control Strategy
- Use branches for new features
- Maintain clear commit messages
- Tag versions (v1.0, v2.0, etc.)
- Merge feature branches into main

Example:
- main branch: stable code
- feature/timer
- feature/ui

---

## 11. Folder Structure
```
quiz-app/
│── index.html
│── style.css
│── script.js
│── questions.json
```

---

## 12. Milestones
- Week 1: Version 1
- Week 2: Version 2
- Week 3: Version 3
- Week 4: Version 4
- Week 5: Version 5

---

## 13. Risks
- Improper Git usage
- Feature overlap
- Time constraints

---

## 14. Success Criteria
- Fully functional quiz app
- Clear version history in GitHub
- Proper documentation
- Demonstration of feature evolution

---

## 15. Future Enhancements
- Backend integration
- AI-based question generation
- User login system

---

## 16. Conclusion
This project demonstrates how software evolves over time using version control, while also delivering a functional quiz application. It highlights the importance of structured development and tracking changes efficiently.

