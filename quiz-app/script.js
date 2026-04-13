const questions = [
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Hyper Transfer Markup Language",
      "Home Tool Markup Language"
    ],
    answer: 0
  },
  {
    question: "Which keyword is used to declare a variable in JavaScript (ES6+)?",
    options: ["var", "let", "define", "set"],
    answer: 1
  },
  {
    question: "What does CSS stand for?",
    options: [
      "Creative Style Sheets",
      "Cascading Style Sheets",
      "Computer Style Sheets",
      "Colorful Style Sheets"
    ],
    answer: 1
  },
  {
    question: "Which HTML tag is used to link an external JavaScript file?",
    options: ["<js>", "<link>", "<script>", "<javascript>"],
    answer: 2
  },
  {
    question: "Which of the following is NOT a JavaScript data type?",
    options: ["String", "Boolean", "Float", "Undefined"],
    answer: 2
  }
];

let currentIndex = 0;
let score = 0;
let answered = false;

const startScreen  = document.getElementById('start-screen');
const quizScreen   = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

const questionText  = document.getElementById('question-text');
const optionsList   = document.getElementById('options-list');
const currentQEl    = document.getElementById('current-q');
const totalQEl      = document.getElementById('total-q');
const nextBtn       = document.getElementById('next-btn');
const progressFill  = document.getElementById('progress-fill');

document.getElementById('start-btn').addEventListener('click', startQuiz);
nextBtn.addEventListener('click', nextQuestion);
document.getElementById('restart-btn').addEventListener('click', restartQuiz);

function startQuiz() {
  currentIndex = 0;
  score = 0;
  totalQEl.textContent = questions.length;
  show(quizScreen);
  hide(startScreen);
  loadQuestion();
}

function loadQuestion() {
  answered = false;
  nextBtn.disabled = true;

  const q = questions[currentIndex];
  currentQEl.textContent = currentIndex + 1;
  questionText.textContent = q.question;

  // Update progress bar
  progressFill.style.width = ((currentIndex / questions.length) * 100) + '%';

  // Clear previous options using safe DOM removal
  while (optionsList.firstChild) {
    optionsList.removeChild(optionsList.firstChild);
  }

  q.options.forEach((opt, i) => {
    const li = document.createElement('li');
    li.textContent = opt;
    li.addEventListener('click', () => selectAnswer(i));
    optionsList.appendChild(li);
  });
}

function selectAnswer(selectedIndex) {
  if (answered) return;
  answered = true;

  const q = questions[currentIndex];
  const items = optionsList.querySelectorAll('li');

  items[selectedIndex].classList.add(selectedIndex === q.answer ? 'correct' : 'wrong');

  if (selectedIndex !== q.answer) {
    items[q.answer].classList.add('correct');
  } else {
    score++;
  }

  nextBtn.disabled = false;
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  progressFill.style.width = '100%';
  hide(quizScreen);
  show(resultScreen);

  document.getElementById('score').textContent = score;
  document.getElementById('total').textContent = questions.length;

  const pct = (score / questions.length) * 100;
  const msg =
    pct === 100 ? "Perfect score! Outstanding!" :
    pct >= 60   ? "Good job! Keep it up!" :
                  "Keep practicing, you'll get there!";

  document.getElementById('score-message').textContent = msg;
}

function restartQuiz() {
  hide(resultScreen);
  startQuiz();
}

function show(el) { el.classList.remove('hidden'); }
function hide(el) { el.classList.add('hidden'); }
