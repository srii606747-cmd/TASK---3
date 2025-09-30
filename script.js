/* ========= INTERACTIVE BACKGROUND ========= */
function changeBackground() {
  const colors = ["#f9f9f9", "#ffe4e1", "#e6f7ff", "#f0fff0", "#fffacd", "#d1c4e9"];
  document.body.style.background = colors[Math.floor(Math.random() * colors.length)];
}

/* ========= DARK MODE ========= */
function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

/* ========= QUIZ (Unlimited via API) ========= */
let quizData = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;

async function loadQuizData() {
  // Fetch 10 random questions from OpenTDB API
  const res = await fetch("https://opentdb.com/api.php?amount=10&type=multiple");
  const data = await res.json();

  quizData = data.results.map(q => {
    const options = [...q.incorrect_answers, q.correct_answer];
    // shuffle options
    options.sort(() => Math.random() - 0.5);
    return {
      question: decodeHTML(q.question),
      options: options.map(o => decodeHTML(o)),
      answer: decodeHTML(q.correct_answer),
      explanation: `Correct answer: ${decodeHTML(q.correct_answer)}`
    };
  });

  loadQuestion();
}

function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function loadQuestion() {
  if (currentQuestionIndex >= quizData.length) {
    // load more questions automatically for unlimited quiz
    currentQuestionIndex = 0;
    loadQuizData();
    return;
  }

  const q = quizData[currentQuestionIndex];
  document.getElementById("question").textContent = q.question;
  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";
  document.getElementById("explanation").textContent = "";

  q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.onclick = () => selectAnswer(option, btn);
    optionsContainer.appendChild(btn);
  });

  document.getElementById("next-btn").disabled = true;
  updateProgress();
  startTimer();
}

function selectAnswer(selected, btn) {
  const q = quizData[currentQuestionIndex];
  clearInterval(timer);
  const buttons = document.querySelectorAll("#options button");
  buttons.forEach(b => b.disabled = true);

  if (selected === q.answer) {
    score++;
    btn.style.background = "green";
  } else {
    btn.style.background = "red";
  }

  document.getElementById("explanation").textContent = q.explanation;
  document.getElementById("next-btn").disabled = false;
}

function nextQuestion() {
  currentQuestionIndex++;
  loadQuestion();
}

function updateProgress() {
  document.getElementById("progress").textContent = `Question ${currentQuestionIndex + 1} of ${quizData.length}`;
}

function startTimer() {
  timeLeft = 15;
  document.getElementById("timer").textContent = `⏳ ${timeLeft}s left`;
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = `⏳ ${timeLeft}s left`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      nextQuestion();
    }
  }, 1000);
}

/* ========= CAROUSEL ========= */
let currentImage = 1;
const carouselImage = document.getElementById("carouselImage");

function nextImage() {
  currentImage++;
  updateImage();
}
function prevImage() {
  currentImage--;
  if (currentImage < 1) currentImage = 5;
  updateImage();
}
function updateImage() {
  carouselImage.style.opacity = 0;
  setTimeout(() => {
    carouselImage.src = `https://picsum.photos/400/200?random=${currentImage}`;
    carouselImage.style.opacity = 1;
  }, 400);
}
carouselImage.addEventListener("click", () => {
  currentImage = Math.floor(Math.random() * 20) + 1;
  updateImage();
});

/* ========= JOKES API ========= */
async function fetchJoke() {
  const res = await fetch("https://official-joke-api.appspot.com/random_joke");
  const data = await res.json();
  const jokeDiv = document.createElement("div");
  jokeDiv.textContent = `${data.setup} — ${data.punchline}`;
  document.getElementById("joke-container").appendChild(jokeDiv);
}

/* ========= START ========= */
window.onload = loadQuizData;
