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

//Questions
class Question {
    constructor(question, choices, CorrectChoice) {
      this.question = question;
      this.choices = choices;
      this.CorrectChoice = CorrectChoice;
    }
  }