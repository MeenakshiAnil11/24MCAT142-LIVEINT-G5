// DOM Elements
const startBtn = document.getElementById("start-btn");
const categorySelect = document.getElementById("category");
const difficultySelect = document.getElementById("difficulty");
const questionContainer = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextBtn = document.getElementById("next-btn");
const resultsContainer = document.getElementById("results");
const scoreElement = document.getElementById("score");
const totalElement = document.getElementById("total");
const restartBtn = document.getElementById("restart-btn");
const loadingElement = document.getElementById("loading");

// Quiz State
let currentQuestionIndex = 0;
let score = 0;
let questions = [];

// Event Listeners
startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    setNextQuestion();
});
restartBtn.addEventListener("click", restartQuiz);

// Start Quiz
async function startQuiz() {
    startBtn.classList.add("hidden");
    categorySelect.classList.add("hidden");
    difficultySelect.classList.add("hidden");
    loadingElement.classList.remove("hidden");

    const category = categorySelect.value;
    const difficulty = difficultySelect.value;

    try {
        const response = await fetch(
            `https://the-trivia-api.com/api/questions?limit=10&category=${category}&difficulty=${difficulty}`
        );
        questions = await response.json();
        loadingElement.classList.add("hidden");
        questionContainer.classList.remove("hidden");
        currentQuestionIndex = 0;
        score = 0;
        setNextQuestion();
    } catch (error) {
        console.error("Error fetching questions:", error);
        loadingElement.textContent = "Failed to load questions. Please try again.";
    }
}

// Display Question
function setNextQuestion() {
    resetState();
    if (currentQuestionIndex < questions.length) {
        showQuestion(questions[currentQuestionIndex]);
    } else {
        showResults();
    }
}

function showQuestion(question) {
    questionElement.textContent = question.question;
    const answers = [...question.incorrectAnswers, question.correctAnswer];
    answers.sort(() => Math.random() - 0.5); // Shuffle answers

    answers.forEach(answer => {
        const button = document.createElement("button");
        button.textContent = answer;
        button.classList.add("btn");
        button.addEventListener("click", () => selectAnswer(answer, question.correctAnswer));
        answerButtons.appendChild(button);
    });
}

// Check Answer
function selectAnswer(selectedAnswer, correctAnswer) {
    Array.from(answerButtons.children).forEach(button => {
        button.disabled = true;
        if (button.textContent === correctAnswer) {
            button.classList.add("correct");
        } else if (button.textContent === selectedAnswer && selectedAnswer !== correctAnswer) {
            button.classList.add("incorrect");
        }
    });

    if (selectedAnswer === correctAnswer) {
        score++;
    }

    nextBtn.classList.remove("hidden");
}

// Reset Quiz State
function resetState() {
    nextBtn.classList.add("hidden");
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

// Show Results
function showResults() {
    questionContainer.classList.add("hidden");
    resultsContainer.classList.remove("hidden");
    scoreElement.textContent = score;
    totalElement.textContent = questions.length;
}

// Restart Quiz
function restartQuiz() {
    resultsContainer.classList.add("hidden");
    startBtn.classList.remove("hidden");
    categorySelect.classList.remove("hidden");
    difficultySelect.classList.remove("hidden");
}