//Section list
const quizSections = document.querySelectorAll(".quiz-section");

//Start
const startSelect = document.getElementById("start");
const startBtn = document.getElementById("start-button");

//Quiz questions
const quizSection = document.getElementById("quiz-questions");
const timeRemain = document.getElementById("time-remaining");
const questions = document.getElementById("question");
const choices = document.getElementById("choices");
const choiceStatus = document.querySelectorAll(".choice-status");
const correct = document.getElementById("correct");
const wrong = document.getElementById("wrong");

//End
const endSection = document.getElementById("end");
const score = document.getElementById("score");
const initials = document.getElementById("score-name");
const submitScore = document.getElementById("submit-score");
const errorMessage = document.getElementById("error-message");

//Questions
class Question {
    constructor(question, choices, correctChoice) {
      this.question = question;
      this.choices = choices;
      this.correctChoice = correctChoice;
    }
  }
const question1 = new Question("Commonly used data types DO NOT include: ", 
  ["Strings", "Booleans", "Alerts", "Numbers"], 2);
const question2 = new Question("The condition in an if / else statement is enclosed within ____.", 
  ["Quotes", "Curly brackets", "Parentheses", "Square brackets"], 2);
const question3 = new Question("Arrays in JavaScript can be used to store ____.", 
  ["Numbers and Strings", "Other arrays", "Booleans", "All of the above"], 3);
const question4 = new Question("String values must be enclosed within _____ when being assigned to variables.", 
  ["Commas", "Curly brackets", "Quotes", "Parentheses"], 2);
const question5 = new Question("A very useful tool used during development and debugging for printing content to the debugger is: ", 
  ["JavaScript", "Terminal/Bash", "For Loops", "console.log"], 3);
const questionList = [question1, question2, question3, question4, question5];

let currentQuestion = 0;

let totalTime = 60;
let totalTimeInterval;
let choiceStatusTimeout; 

/******** EVENT LISTENERS ********/ 
startBtn.addEventListener('click', startGame);
choices.addEventListener('click', processChoice);
submitScore.addEventListener('submit', processInput);

/******** START GAME ********/ 
function startGame() {
  showElement(quizSections, quizSection);
  
  displayTime();  
  displayQuestion();

  startTimer();
}

/******** SHOWING/HIDING ELEMENTS ********/ 
function showElement(siblingList, showElement) {
    for (element of siblingList) {
      hideElement(element);
    }
    showElement.classList.remove("hidden");
  } 
  
  function hideElement(element) {
    if (!element.classList.contains("hidden")) {
      element.classList.add("hidden");
    }
  }
  
  /******** TIME ********/ 
  function displayTime() {
    timeRemain.textContent = totalTime;
  }
  
  function startTimer() {
    totalTimeInterval = setInterval(function() {
      totalTime--;
      displayTime();
      checkTime();
  
    }, 1000);
  }
  
  function checkTime() {
    if (totalTime <= 0) {
      totalTime = 0;
      endGame();
    }
  }
  
 /******** QUESTIONS ********/ 
function displayQuestion() {
    Question.textContent = questionList[currentQuestion].question;
  
    displayChoiceList();
  }
  
  function displayChoiceList() {
    choices.innerHTML = "";
  
    questionList[currentQuestion].choices.forEach(function(answer, index) {
      const li = document.createElement("li");
      li.dataset.index = index;
      const button = document.createElement("button");
      button.textContent = (index + 1) + ". " + answer;
      li.appendChild(button);
      choices.appendChild(li);
    });
  }
  
  //when user answers a question
  function processChoice(event) {
    const userChoice = parseInt(event.target.parentElement.dataset.index);
  
    checkChoice(userChoice);
    getNextQuestion();
  }

  function checkChoice(userChoice) {
    if (isChoiceCorrect(userChoice)) {
      displayCorrectChoiceEffects();
    } else {
      displayWrongChoiceEffects();
    }
  }
  
  function isChoiceCorrect(choice) {
    return choice === questionList[currentQuestion].correctChoice;
  }
  
  function displayWrongChoiceEffects() {
    deductTimeBy(10);

    choiceStatusTimeout = setTimeout(function() {
      hideElement(wrong);
    }, 1000);
  }
  
  function deductTimeBy(seconds) {
    totalTime -= seconds;
    checkTime();
    displayTime();
  }
  
  function displayCorrectChoiceEffects() {
    showElement(choiceStatus, correct);
  
    choiceStatusTimeout = setTimeout(function() {
      hideElement(correct);
    }, 1000);
  }
  
  //Get next question
  function getNextQuestion() {
    currentQuestion++;
    if (currentQuestion >= questionList.length) {
      endGame();
    } else {
      displayQuestion();
    }
  }
  
  /******** ENDING THE GAME ********/ 
  function endGame() {
    clearInterval(totalTimeInterval);
    
    showElement(quizSections, endSection);
    displayScore();
    setEndHeading();
  }
  
  function displayScore() {
    score.textContent = totalTime;
  }
  
  /******** SUBMITTING INITIALS ********/ 
  function processInput(event) {
    event.preventDefault();
  
    const initial = initials.value.toUpperCase();
  
    if (isInputValid(initial)) {
      const score = totalTime;
      const highscoreEntry = getNewHighscoreEntry(initial, score);
      saveHighscoreEntry(highscoreEntry);
      window.location.href= "./highscores.html";
    }
  }
  
  function getNewHighscoreEntry(initial, score) {
    const entry = {
      initials: initial,
      score: score,
    }
    return entry;
  }
  
  function isInputValid(initials) {
    let errorMessage = "";
    if (initials === "") {
      errorMessage = "You can't submit empty initials!";
      displayFormError(errorMessage);
      return false;
    } else if (initials.match(/[^a-z]/ig)) {
      errorMessage = "Initials may only include letters."
      displayFormError(errorMessage);
      return false;
    } else {
      return true;
    }
  }
  

  function saveHighscoreEntry(highscoreEntry) {
    const currentScores = getScoreList();
    placeEntryInHighscoreList(highscoreEntry, currentScores);
    localStorage.setItem('scoreList', JSON.stringify(currentScores));
  }
  
  function getScoreList() {
    const currentScores = localStorage.getItem('scoreList');
    if (currentScores) {
      return JSON.parse(currentScores);
    } else {
      return [];
    }
  }
  
  function placeEntryInHighscoreList(newEntry, scoreList) {
    const newScoreIndex = getNewScoreIndex(newEntry, scoreList);
    scoreList.splice(newScoreIndex, 0, newEntry);
  }
  
  function getNewScoreIndex(newEntry, scoreList) {
    if (scoreList.length > 0) {
      for (let i = 0; i < scoreList.length; i++) {
        if (scoreList[i].score <= newEntry.score) {
          return i;
        }
      } 
    }
    return scoreList.length;
  }