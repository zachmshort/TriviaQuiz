// GIVEN I am taking a code quiz
// WHEN I click the start button
// THEN a timer starts and I am presented with a question
// WHEN I answer a question
// THEN I am presented with another question
// WHEN I answer a question incorrectly
// THEN time is subtracted from the clock
// WHEN all questions are answered or the timer reaches 0
// THEN the game is over
// WHEN the game is over
// THEN I can save my initials and score

// PSEUDO
// Create start button that listens for click and initializes game
// First question appears and timer of 60 sec counting down. 
// After user answers question, they are told answer is (in)correct, count goes down more if incorrect, next question appears, and value storing player score adjusts accordingly
// Repeat until user runs out of time or answers all questions
// Prompt user to enter name, store, and display along with their score
// Bonus, GO BACK BUTTON to allow user to replay game

// Notes
// High scores must be stored in local storage so the table can be updated after each iteration of the game


// Array of trivia questions
var quizData = [ 
    {
question: 'The tallest man ever recorded was how tall?',
choices: ['8 feet 11 inches', '7 feet 5 inches', '9 feet 3 inches'],
correctAnswer: 0,
    },
    {
question: 'What year was the first ever college football game?',
choices: ['1910', '1869', '1832'],
correctAnswer: 1,
    },
    {
question: 'What was the original name of the search engine Google?',
choices: ['Google', 'DiscoverNow', 'Backrub'],
correctAnswer: 2,
    },
    {
question: 'How many times larger is the average elephant heart than a human heart',
choices: ['200', '48', '93'],
correctAnswer: 1,
    },
    {
question: 'What percent of the world population watched the 2018 FIFA World Cup',
choices: ['37%', '50%', '22%'],
correctAnswer: 1,
    },
    {
question: 'How many times does the average heart pump blood over 70 years?',
choices: ['4.3 billion', '375 million', '2.5 billion'],
correctAnswer: 2,
    },
    
];

var currentQuestionIndex = 0;
var score = 0;
var timer;
var timeLeft = 60; // Set the initial time for the quiz

//questionElement, I realize I should just write them out so its clearer
var qEl = document.getElementById('question');
var choicesElement = document.getElementById('choices');
var feedbackElement = document.getElementById('feedback');
var timerElement = document.getElementById('time');
var highscoreContainer = document.getElementById('highscore-container');
var highscoresElement = document.getElementById('highscores');
var goBackButton = document.getElementById('go-back');
var clearScoresButton = document.getElementById('clear-scores');

// Couldn't get start button to work so the quiz starts by default and timer starts
function startQuiz() {
  showQuestion();
  timer = setInterval(updateTimer, 1000);
}

//Function called in startQuiz, displays the current question based on placed in quiz data array, starts at zero and updates
function showQuestion() {
  var currentQuestion = quizData[currentQuestionIndex];
  qEl.textContent = currentQuestion.question;
  choicesElement.innerHTML = '';
  currentQuestion.choices.forEach(function (choice, index) {
    var li = document.createElement('li');
    li.textContent = choice;
    li.addEventListener('click', function () {
      checkAnswer(index);
    });
    choicesElement.appendChild(li);
  });
}

// checks if answer is correct
// if correct, time is not changed and user score is increased +1
// if incorrect, user loses time and score does not change
// message displays letting them know they're right/wrong
function checkAnswer(index) {
  var currentQuestion = quizData[currentQuestionIndex];

  if (index === currentQuestion.correctAnswer) {
    score++;
    feedbackElement.textContent = 'Correct!';
  } else {
    timeLeft -= 10; 
    feedbackElement.textContent = 'Close, but no cigar!';
  }

// updates question displayed in quizData array
  currentQuestionIndex++;

// tests if user has reached the end of the quiz  if they've gone through all the questions
  if (currentQuestionIndex < quizData.length) {
    showQuestion();
  } else {
    endQuiz();
  }
}

// Function to end quiz, timer goes to 0, displays user score.
function endQuiz() {
  clearInterval(timer);
  timerElement.textContent = '0';
  feedbackElement.textContent = 'You got ' + score + ' questions correct.';
  showHighscores();
}


//timer tick
function updateTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    timerElement.textContent = timeLeft;
  } else {
    endQuiz();
  }
}


// Stores the scores in local storage to be displayed and adds event listener to goBack button so it reloads the page
function showHighscores() {
  highscoreContainer.classList.remove('hidden');
  highscoresElement.innerHTML = '';

  var storedHighscores = JSON.parse(localStorage.getItem('highscores')) || [];

  storedHighscores.forEach(function (highscore, index) {
    var li = document.createElement('li');
    li.textContent = index + 1 + '. ' + highscore.name + ' - ' + highscore.score;
    highscoresElement.appendChild(li);
  });

  var currentScore = { name: prompt('Enter your name:'), score: score };
  storedHighscores.push(currentScore);

  // Sort highscores in descending order

  storedHighscores.sort(function (a, b) {
    return b.score - a.score;
  }); 

  localStorage.setItem('highscores', JSON.stringify(storedHighscores));

  goBackButton.addEventListener('click', function () {
    return location.reload();
  });
  clearScoresButton.addEventListener('click', function () {
    localStorage.removeItem('highscores');
    showHighscores();
  });
}

startQuiz();