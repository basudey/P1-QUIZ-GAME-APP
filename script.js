// === SECTION 1: DOM ELEMENTS ===
// The DOM (Document Object Model) is how JavaScript interacts with HTML.
// These lines select all the HTML elements we need to control.
// `document.getElementById()` is a core method to get an element by its unique ID.
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score");
const resultMessage = document.getElementById("result-message");
const restartButton = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress");

// === SECTION 2: QUIZ QUESTIONS DATA ===
// This is an array (a list) of objects. Each object represents a single question.
// This structure is easy to read and manage. You can add or remove questions here.
const quizQuestions = [
  {
    question: "What is the capital of France?",
    answers: [
      { text: "London", correct: false },
      { text: "Berlin", correct: false },
      { text: "Paris", correct: true },
      { text: "Madrid", correct: false },
    ],
  },
  {
    question: "Which planet is known as the Red Planet?",
    answers: [
      { text: "Venus", correct: false },
      { text: "Mars", correct: true },
      { text: "Jupiter", correct: false },
      { text: "Saturn", correct: false },
    ],
  },
  {
    question: "What is the largest ocean on Earth?",
    answers: [
      { text: "Atlantic Ocean", correct: false },
      { text: "Indian Ocean", correct: false },
      { text: "Arctic Ocean", correct: false },
      { text: "Pacific Ocean", correct: true },
    ],
  },
  {
    question: "Which of these is NOT a programming language?",
    answers: [
      { text: "Java", correct: false },
      { text: "Python", correct: false },
      { text: "Banana", correct: true },
      { text: "JavaScript", correct: false },
    ],
  },
  {
    question: "What is the chemical symbol for gold?",
    answers: [
      { text: "Go", correct: false },
      { text: "Gd", correct: false },
      { text: "Au", correct: true },
      { text: "Ag", correct: false },
    ],
  },
];

// === SECTION 3: QUIZ STATE VARIABLES & EVENT LISTENERS ===
// These variables track the quiz's current state (e.g., question number, score).
// `let` is used because their values will change.
let currentQuestionIndex = 0;
let score = 0;
let answerDisabled = false; // A flag to prevent multiple clicks on answers

// Set the total number of questions on the screen using the `textContent` property.
totalQuestionsSpan.textContent = quizQuestions.length;
maxScoreSpan.textContent = quizQuestions.length;

// `addEventListener()` is a method that waits for a user action (an "event").
// When the "click" event happens, it runs the function we specify.
startButton.addEventListener("click", startQuiz);
restartButton.addEventListener("click", restartQuiz);

// === SECTION 4: CORE QUIZ FUNCTIONS ===

// `startQuiz()`: This function begins the game.
function startQuiz() {
  // Reset all game state variables to their starting values.
  currentQuestionIndex = 0;
  score = 0;
  scoreSpan.textContent = 0;

  // `classList` is a property that lets you add or remove CSS classes.
  // We remove the "active" class from the start screen (hiding it) and add it to the quiz screen (showing it).
  startScreen.classList.remove("active");
  quizScreen.classList.add("active");

  // Call the function to display the first question.
  showQuestion();
}

// `showQuestion()`: This function displays the current question and its answers.
function showQuestion() {
  // Reset the flag to allow clicks on the new question.
  answerDisabled = false;
  // Select the current question object from our array using its index.
  const currentQuestion = quizQuestions[currentQuestionIndex];

  // Update the progress counter using `textContent`.
  currentQuestionSpan.textContent = currentQuestionIndex + 1;

  // The `style` property allows us to set CSS styles directly in JavaScript.
  // We calculate the percentage and set the width of the progress bar.
  const progressPercent = (currentQuestionIndex / quizQuestions.length) * 100;
  progressBar.style.width = progressPercent + "%";

  // Set the question text.
  questionText.textContent = currentQuestion.question;

  // The `innerHTML` property gets or sets the HTML content inside an element.
  // Setting it to an empty string effectively removes all previous answer buttons.
  answersContainer.innerHTML = "";

  // The `forEach()` method loops through each item in the `answers` array.
  currentQuestion.answers.forEach((answer) => {
    // `document.createElement()` creates a new HTML button element.
    const button = document.createElement("button");
    button.textContent = answer.text;
    button.classList.add("answer-btn");

    // The `dataset` property is a way to store custom data on an HTML element.
    // We store whether the answer is correct (`true` or `false`) right on the button.
    button.dataset.correct = answer.correct;

    // We add a click listener to the new button to run the `selectAnswer` function.
    button.addEventListener("click", selectAnswer);

    // `appendChild()` adds the new button element to the answers container in the HTML.
    answersContainer.appendChild(button);
  });
}

// `selectAnswer()`: This function runs when an answer button is clicked.
function selectAnswer(event) {
  // Check our flag. If an answer has already been clicked, the `return` statement
  // stops the function from running any more code.
  if (answerDisabled) return;

  // Set the flag to true to disable further clicks on this question.
  answerDisabled = true;

  // `event.target` is a key property that refers to the exact element that was clicked.
  const selectedButton = event.target;
  // We check the `dataset.correct` value we stored earlier.
  const isCorrect = selectedButton.dataset.correct === "true";

  // `Array.from()` is used to convert the `answersContainer.children` (a `NodeList`)
  // into a proper array so we can use the `.forEach()` method to loop over all buttons.
  Array.from(answersContainer.children).forEach((button) => {
    // If a button's `dataset` says it's correct, we add the "correct" class (e.g., green color).
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    }
    // If the button the user clicked is not the correct one, we add the "incorrect" class (e.g., red color).
    else if (button === selectedButton) {
      button.classList.add("incorrect");
    }
  });

  // If the answer was correct, increment the score.
  if (isCorrect) {
    score++;
    scoreSpan.textContent = score;
  }

  // `setTimeout()` runs a function after a specified delay (1000ms = 1 second).
  // This gives the user a moment to see the feedback before the next question loads.
  setTimeout(() => {
    // Move to the next question.
    currentQuestionIndex++;

    // Check if there are more questions.
    if (currentQuestionIndex < quizQuestions.length) {
      showQuestion(); // Show the next question.
    } else {
      showResults(); // The quiz is over, so show the results screen.
    }
  }, 1000);
}

// `showResults()`: This function is called when the quiz ends.
function showResults() {
  quizScreen.classList.remove("active");
  resultScreen.classList.add("active");

  finalScoreSpan.textContent = score;

  // Display a custom message based on the user's performance.
  const percentage = (score / quizQuestions.length) * 100;
  if (percentage === 100) {
    resultMessage.textContent = "Perfect! You're a genius!";
  } else if (percentage >= 80) {
    resultMessage.textContent = "Great job! You know your stuff!";
  } else if (percentage >= 60) {
    resultMessage.textContent = "Good effort! Keep learning!";
  } else if (percentage >= 40) {
    resultMessage.textContent = "Not bad! Try again to improve!";
  } else {
    resultMessage.textContent = "Keep studying! You'll get better!";
  }
}

// `restartQuiz()`: This function resets the game to its starting state.
function restartQuiz() {
  resultScreen.classList.remove("active");
  // By calling `startQuiz()`, we reset all the variables and begin the quiz from the beginning.
  startQuiz();
}
