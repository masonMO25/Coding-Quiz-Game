const quizSections = document.querySelectorAll(".quiz-section");

const startSelect = document.getElementById("start");
const startBtn = document.getElementById("start-button");

const quizSection = document.getElementById("quiz-questions");
const timeRemain = document.getElementById("time-remaining");
const questions = document.getElementById("question");
const choices = document.getElementById("choices");
const choiceStatus = document.querySelectorAll(".choice-status");
const correct = document.getElementById("correct");
const wrong = document.getElementById("wrong");

const endSection = document.getElementById("end");
const score = document.getElementById("score");
const initials = document.getElementById("score-name");
const submitScore = document.getElementById("submit-score");
const errorMessage = document.getElementById("error-message");


class Question {
    constructor(question, choices, correctChoice) {
      this.question = question;
      this.choices = choices;
      this.correctChoice = correctChoice;
    }
  }
const question1 = new Question("To access an HTML element from JavaScript, you can use this method ", 
  ["addEventListener", "const", "getElementById", "querySelectorAll"], 2);
const question2 = new Question("How many values does a Boolean have?", 
  ["0", "1", "2", "3"], 2);
const question3 = new Question("What is a block of code that is executed when someone calls it?", 
  ["strings", "for loops", "array", "function"], 3);
const question4 = new Question("What operator is used to assign values to JavaScript variables?", 
  ["==", "+=", "=", "-="], 2);
const question5 = new Question("What is the logical operator for 'and'? ", 
  ["||", "!==", "!", "&&"], 3);
const questionList = [question1, question2, question3, question4, question5];

let currentQuestion = 0;

let totalTime = 60;
let totalTimeInterval;
let choiceStatusTimeout; 


startBtn.addEventListener('click', startGame);
choices.addEventListener('click', processChoice);
submitScore.addEventListener('submit', processInput);


function startGame() {
  showElement(quizSections, quizSection);
  
  displayTime();  
  displayQuestion();

  startTimer();
}


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
  
 
function displayQuestion() {
    questions.textContent = questionList[currentQuestion].question;
  
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
  

  function getNextQuestion() {
    currentQuestion++;
    if (currentQuestion >= questionList.length) {
      endGame();
    } else {
      displayQuestion();
    }
  }
  
  
  function endGame() {
    clearInterval(totalTimeInterval);
    
    showElement(quizSections, endSection);
    displayScore();
  }
  
  function displayScore() {
    score.textContent = totalTime;
  }
   
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