const TIME_LIMIT = 15;
const HISTORY_KEY = 'quizHistory';

let allQuestions = [];
let questions = [];
let currentIndex = 0;
let score = 0;
let answered = false;
let timerInterval = null;
let timeLeft = TIME_LIMIT;
let selectedDifficulty = 'all';

const startScreen  = document.getElementById('start-screen');
const quizScreen   = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

const questionText  = document.getElementById('question-text');
const optionsList   = document.getElementById('options-list');
const currentQEl    = document.getElementById('current-q');
const totalQEl      = document.getElementById('total-q');
const nextBtn       = document.getElementById('next-btn');
const progressFill  = document.getElementById('progress-fill');
const timerText     = document.getElementById('timer-text');
const timerRingFill = document.getElementById('timer-ring-fill');
const CIRCUMFERENCE = 2 * Math.PI * 16; // ≈ 100.53

// Difficulty buttons
document.querySelectorAll('.diff-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedDifficulty = btn.dataset.difficulty;
  });
});

document.getElementById('start-btn').addEventListener('click', startQuiz);
nextBtn.addEventListener('click', nextQuestion);
document.getElementById('restart-btn').addEventListener('click', restartQuiz);
document.getElementById('home-btn').addEventListener('click', goHome);

// ── Helpers ───────────────────────────────────────────────────────────────────

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function show(el) { el.classList.remove('hidden'); }
function hide(el) { el.classList.add('hidden'); }

// ── LocalStorage ──────────────────────────────────────────────────────────────

function getHistory() {
  return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
}

function saveAttempt(score, total, difficulty) {
  const history = getHistory();
  history.unshift({
    score,
    total,
    difficulty,
    date: new Date().toLocaleDateString()
  });
  if (history.length > 20) history.length = 20;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

// ── Questions ─────────────────────────────────────────────────────────────────

async function fetchQuestions() {
  const response = await fetch('questions.json');
  allQuestions = await response.json();
}

function filterAndShuffle() {
  const pool = selectedDifficulty === 'all'
    ? allQuestions
    : allQuestions.filter(q => q.difficulty === selectedDifficulty);
  questions = shuffle([...pool]);
}

// ── Quiz Flow ─────────────────────────────────────────────────────────────────

async function startQuiz() {
  if (allQuestions.length === 0) await fetchQuestions();
  filterAndShuffle();

  if (questions.length === 0) {
    alert('No questions available for this difficulty. Please choose another.');
    return;
  }

  currentIndex = 0;
  score = 0;
  totalQEl.textContent = questions.length;
  hide(startScreen);
  show(quizScreen);
  loadQuestion();
}

function startTimer() {
  stopTimer();
  timeLeft = TIME_LIMIT;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      stopTimer();
      timeExpired();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function updateTimerDisplay() {
  const fraction = timeLeft / TIME_LIMIT;
  timerText.textContent = timeLeft;
  timerRingFill.style.strokeDashoffset = CIRCUMFERENCE * (1 - fraction);
  const urgent = timeLeft <= 5;
  timerText.classList.toggle('urgent', urgent);
  timerRingFill.classList.toggle('urgent', urgent);
}

function timeExpired() {
  if (answered) return;
  answered = true;
  const items = optionsList.querySelectorAll('li');
  items[questions[currentIndex].answer].classList.add('correct');
  items.forEach(li => li.classList.add('no-answer'));
  nextBtn.disabled = false;
}

function loadQuestion() {
  answered = false;
  nextBtn.disabled = true;

  const q = questions[currentIndex];
  currentQEl.textContent = currentIndex + 1;
  questionText.textContent = q.question;
  progressFill.style.width = ((currentIndex / questions.length) * 100) + '%';

  while (optionsList.firstChild) {
    optionsList.removeChild(optionsList.firstChild);
  }

  q.options.forEach((opt, i) => {
    const li = document.createElement('li');
    li.textContent = opt;
    li.addEventListener('click', () => selectAnswer(i));
    optionsList.appendChild(li);
  });

  startTimer();
}

function selectAnswer(selectedIndex) {
  if (answered) return;
  answered = true;
  stopTimer();

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
  stopTimer();
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

  saveAttempt(score, questions.length, selectedDifficulty);
  renderHistory();
}

function renderHistory() {
  const history = getHistory();
  const section = document.getElementById('history-section');
  const list = document.getElementById('history-list');

  while (list.firstChild) list.removeChild(list.firstChild);

  if (history.length === 0) {
    hide(section);
    return;
  }

  show(section);
  // Show last 5 attempts
  history.slice(0, 5).forEach(entry => {
    const li = document.createElement('li');
    const pct = Math.round((entry.score / entry.total) * 100);
    const badge = entry.difficulty !== 'all' ? ` [${entry.difficulty}]` : '';
    li.textContent = `${entry.date}${badge} — ${entry.score}/${entry.total} (${pct}%)`;
    list.appendChild(li);
  });
}

// ── Leaderboard ───────────────────────────────────────────────────────────────

function renderLeaderboard() {
  const history = getHistory();
  const section = document.getElementById('leaderboard-section');
  const list = document.getElementById('leaderboard-list');

  while (list.firstChild) list.removeChild(list.firstChild);

  if (history.length === 0) {
    hide(section);
    return;
  }

  // Sort by percentage desc, then by date (most recent first for ties)
  const sorted = [...history].sort((a, b) => {
    const pctA = a.score / a.total;
    const pctB = b.score / b.total;
    return pctB - pctA;
  });

  show(section);
  sorted.slice(0, 5).forEach((entry, i) => {
    const li = document.createElement('li');
    const pct = Math.round((entry.score / entry.total) * 100);
    const badge = entry.difficulty !== 'all' ? ` [${entry.difficulty}]` : '';
    li.textContent = `${entry.score}/${entry.total} (${pct}%)${badge} — ${entry.date}`;
    if (i === 0) li.classList.add('gold');
    if (i === 1) li.classList.add('silver');
    if (i === 2) li.classList.add('bronze');
    list.appendChild(li);
  });
}

function goHome() {
  hide(resultScreen);
  renderLeaderboard();
  show(startScreen);
}

function restartQuiz() {
  hide(resultScreen);
  startQuiz();
}

// ── Init ──────────────────────────────────────────────────────────────────────

renderLeaderboard();
