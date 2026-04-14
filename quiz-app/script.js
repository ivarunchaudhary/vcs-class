const TIME_LIMIT = 15;

let questions = [];
let currentIndex = 0;
let score = 0;
let answered = false;
let timerInterval = null;
let timeLeft = TIME_LIMIT;

const startScreen  = document.getElementById('start-screen');
const quizScreen   = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

const questionText  = document.getElementById('question-text');
const optionsList   = document.getElementById('options-list');
const currentQEl    = document.getElementById('current-q');
const totalQEl      = document.getElementById('total-q');
const nextBtn        = document.getElementById('next-btn');
const progressFill   = document.getElementById('progress-fill');
const timerText      = document.getElementById('timer-text');
const timerRingFill  = document.getElementById('timer-ring-fill');
const CIRCUMFERENCE  = 2 * Math.PI * 16; // ≈ 100.53

document.getElementById('start-btn').addEventListener('click', startQuiz);
nextBtn.addEventListener('click', nextQuestion);
document.getElementById('restart-btn').addEventListener('click', restartQuiz);

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function loadQuestions() {
  const response = await fetch('questions.json');
  const data = await response.json();
  questions = shuffle(data);
}

async function startQuiz() {
  await loadQuestions();
  currentIndex = 0;
  score = 0;
  totalQEl.textContent = questions.length;
  show(quizScreen);
  hide(startScreen);
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
  // Reveal correct answer; no points awarded
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
}

function restartQuiz() {
  hide(resultScreen);
  startQuiz();
}

function show(el) { el.classList.remove('hidden'); }
function hide(el) { el.classList.add('hidden'); }
