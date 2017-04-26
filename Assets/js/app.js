window.onload = function(){
  "use strict";
  //Declare variables that will be tied to parts of the DOM
  var category = document.getElementById("category");
  var question = document.getElementById("question");
  var a = document.getElementById("a");
  var b = document.getElementById("b");
  var c = document.getElementById("c");
  var d = document.getElementById("d");
  var choices = document.getElementsByClassName("choice");
  var msgHolder = document.getElementById("msgHolder");
  var board = document.getElementById("main");

  var i = 0;

  //Object containing the trivia game
  var game = {

    //Question property is an array of arrays. Each sub array represents question/answer content
    question: [
      ["Category: States", "What was the first US state?", "Massachusetts", "New Jersey", "Connecticut", "Delaware", "d"],
      ["Category: States", "What is the smallest US state by area?", "Rhode Island", "Hawaii", "New Jersey", "Delaware", "a"],
      ["Category: States", "What is the most populated US state?", "New York", "Texas", "California", "Florida", "c"],
      ["Category: States", "What state has the highest mountain in the US?", "Washington", "Colorado", "Alaska", "Wyoming", "c"],
      ["Category: Countries", "What is the largest country by area?", "China", "Russia", "United States", "Canada", "b"],
      ["Category: Countries", "What country has the largest population?", "Russia", "India", "United States", "China", "d"],
      ["Category: Countries", "What is the largest island by area that is also a country?", "Australia", "Madagascar", "Indonesia", "Japan", "c"],
      ["Category: Countries", "What is the most visited country in the world?", "England", "United States", "Japan", "France", "d"],
      ["Category: Bodies of Water", "What is the longest river in the world?", "Amazon", "Nile", "Mississippi", "Hudson", "a"],
      ["Category: Bodies of Water", "What is the biggest lake in the world?", "Superior", "Caspian", "Huron", "Victoria", "b"],
      ["Category: Bodies of Water", "What is the smallest ocean?", "Arctic", "Indian", "Atlantic", "Pacific", "a"],
      ["Category: Bodies of Water", "Which of the following is not a sea?", "Mediterranean", "Caribbean", "Black", "Bangoo", "d"]
    ],

    //Contains the variables that refer to the areas of DOM to be
    //updated with every new question and aligns to the question property above
    display: {
      category: category,
      question: question,
      a: a,
      b: b,
      c: c,
      d: d
    },

    //The current game timer - default is 25 seconds to answer a question and 5 seconds
    //in between questions
    timer: 100,
    displayTimer: "",

    //Current question number
    currentQuestion: 0,

    //Sets the amount of questions in a given "round"
    questionsPerRound: 4,

    remainingQuestions: 4,

    //Past Questions
    pastQuestions: [],

    //Message displayed after round
    message: "",

    //the current game mode. Used to trigger certain events
    mode: "preGame", //modes are: preGame, inQuestion, afterQuestion, endRound, outOfQuestions

    //Keeps track of the right and wrong guesses
    scoreboard: {
      wins: 0,
      losses: 0,
      totalWins: 0,
      totalLosses: 0
    },

    //This key function runs the game clock. It will update the timer per cycle as well
    //as trigger the onTick function to check for game changes. Runs ever tenth of second
    updateTimer: function(){
      this.timer--;
      this.displayTimer = String(Math.ceil(this.timer/10));
      if (this.timer <= 90 && this.timer >= 0 ){
        this.displayTimer = "0" + Math.ceil(this.timer/10); //Keeps game clock formatted to 2 digits
      } else if (this.timer< 0) {
        this.displayTimer = "00"; //Keeps game clock formatted to 2 digits
      }
      this.onTick(this.mode); //Updates game based on the game mode
    },

    //This function does checks on every 'tick' of the game time to watch for game state changes
    //and make calls and updates variables as appropriate.
    onTick: function(mode){
      
      //if there are no more questions show the end of questions screen and allow user to reset game
      if(this.pastQuestions.length >= this.question.length){
        board.className = "row boardBg"
        this.message = "Total Correct: " + this.scoreboard.totalWins + 
          "<br> Total Wrong: " + this.scoreboard.totalLosses;
        this.mode = "outOfQuestions";
        this.display.category.innerHTML = "Push the button to reset the game.";
        this.display.question.innerHTML =  "Oops we ran out of questions!";
        this.display.a.innerHTML = "Reset";
        this.displayMode();
        return;
      }

      //When the game is in preGame mode (on load)
      if(mode === "preGame"){
        this.display.a.className = "choice missedGuess"
        this.display.category.innerHTML = "Push the button to get started.";
        this.display.question.innerHTML =  "Welcome to GeoTrivia";
        this.display.a.innerHTML = "Let's Play!";
        this.displayMode();
        return;
      }
      
      //When the user is currently "in a question" and computer awaiting input
      if(mode === "inQuestion"){
        var _this = this;
        i = 0;
        
        //Update the gameboard with items of the current question
        Object.keys(this.display).forEach(function(el){
          _this.display[el].innerHTML = _this.question[_this.currentQuestion][i];
          if(el.length === 1 ){
            _this.display[el].className = "choice"; //resets the class names to clear formats from correct/incorrect answers
          }
          i++;
        });

        board.className = "row boardBg";
        this.displayMode();

        //When the timer hits zero and user hasn't made a guess
        if(this.timer <= 0 ){
          this.mode = "afterQuestion";
          this.scoreboard.losses++;
          this.message = "Out of time! <br> The right answer was \"" 
            + this.question[this.currentQuestion][this.question[this.currentQuestion].length-1].toUpperCase()
            + "\"";
          this.timer = 30;
          this.remainingQuestions--;
          this.display[this.question[this.currentQuestion][this.question[this.currentQuestion].length-1]].className = "choice missedGuess";
          board.className = "row boardWrong";
        }

        msgHolder.innerHTML = this.displayTimer; //Update the timer
        return;
      }
      
      //If the game is "after a question" in the brief period in between questions
      if(mode === "afterQuestion"){
        msgHolder.innerHTML = this.message;
        
        //When the short between-round timer is up and there are remaining questions in the round
        if (this.timer <= 0 && this.remainingQuestions >= 1) {
          this.mode = "inQuestion";
          this.timer = 100;
          this.pastQuestions.push(this.currentQuestion);
          this.currentQuestion = this.getNewQuestion();
        }

        //When the short between-round timer is up and there are no more questions in the round
        if (this.timer <= 0 && this.remainingQuestions <= 0) {
          this.pastQuestions.push(this.currentQuestion);
          this.currentQuestion = this.getNewQuestion();          
          this.mode = "endRound";
          this.remainingQuestions = this.questionsPerRound;
          this.scoreboard.totalWins += this.scoreboard.wins;
          this.scoreboard.totalLosses += this.scoreboard.losses;
        }
        return;
      }
      
      //If the current round is over this will trigger end-of-round messaging
      if(mode === "endRound"){
        board.className = "row boardBg";
        this.message = this.scoreboard.totalWins + 
          " total correct. <br>" + this.scoreboard.totalLosses + " total wrong.";
        this.display.category.innerHTML = "Round Complete";
        this.display.question.innerHTML =  "You got " + this.scoreboard.wins + 
          " correct <br> and " + this.scoreboard.losses + " wrong.";
        this.display.a.innerHTML = "Next Round";
        this.display.a.className = "choice";
        this.displayMode();
        return;
      }
    },

    //Runs on startup
    init: function() {
      var _this = this

      //Add listener to answer area
      document.getElementById("answers").addEventListener("click", function(el){
        if (el.target.id.length === 1) { //only take clicks on elements with single char id name i.e. "a"
          _this.select(el.target.id);
        }
      });

      this.currentQuestion = this.getNewQuestion();
      this.mode = "preGame";
    },

    //Runs when the user selects an answer/ clicks a "choice" div
    //The button's ID is passed to the function
    select: function(el){

      //If the game is in preGame mode then a click signals the start of the game
      //Moves the game into the "inQuestion" mode 
      if (this.mode === "preGame"){
        this.mode = "inQuestion";
        this.timer = 100;
        return;
      }

      //If the user is "in a question" and computer is awaiting input
      if (this.mode === "inQuestion"){

        //If the user picks the correct option
        if(this.question[this.currentQuestion][this.question[this.currentQuestion].length-1] === el){
          this.scoreboard.wins++;
          this.display[el].className = "choice correct"; //Adding the class "correct" will trigger css formats to the element
          this.message = "Correct!";
          board.className = "row boardCorrect"; //Adding the class "boardCorrect" will trigger css formats to the element

        } else { //If the user didn't make the correct selection
          this.scoreboard.losses++;
          this.display[el].className = "choice incorrect"; //Adding the class "incorrect" will trigger css formats to the element
          board.className = "row boardWrong"; //Adding the class "boardWrong" will trigger css formats to the element
          this.display[this.question[this.currentQuestion][this.question[this.currentQuestion].length-1]].className = "choice missedGuess";
          this.message = "Sorry, the right answer was \""
            + this.question[this.currentQuestion][this.question[this.currentQuestion].length-1].toUpperCase() + "\"";
        }

        //Change the game mode, reset timer to 'in-between questions time limit' reduce the amount of questions in round
        this.mode = "afterQuestion";
        this.timer = 30;
        this.remainingQuestions--;
        return;
      }

      //If the round is over then there is only 1 button to click which will move into next round
      if (this.mode === "endRound"){
        this.mode = "inQuestion";
        this.timer = 100;
        this.scoreboard.wins = 0;
        this.scoreboard.losses = 0;
        return;
      }

      //If the game is out of questions, the button will reset the game
      if(this.mode === "outOfQuestions"){
        this.mode = "preGame";
        this.scoreboard.wins = 0;
        this.scoreboard.losses = 0;
        this.scoreboard.totalWins = 0;
        this.scoreboard.totalLosses = 0;
        this.pastQuestions = [];
        this.message = "";
      }
    },

    //Returns a new quesiton from the library that wasn't already played
    getNewQuestion: function(){
      var tempnum = Math.floor(Math.random() * this.question.length);
      while((this.pastQuestions.indexOf(tempnum) > -1) && (this.pastQuestions.length !== this.question.length)){
        tempnum = Math.floor(Math.random() * this.question.length);
      }
      return tempnum;
    },

    //This function is called during certain redraws (usually from onTick) and will toggle
    //"b," "c," and "d," buttons to display or not. Also updates the msgHolder element
    displayMode: function(){
      if(this.mode === "preGame" || this.mode === "outOfQuestions" || this.mode === "endRound"){
        this.display.b.className = "choice betweenRound";
        this.display.c.className = "choice betweenRound";
        this.display.d.className = "choice betweenRound";
      }
      msgHolder.innerHTML = this.message;
    }
  }; //Close Game Obj

  //Starts the game pulse and timer
  setInterval(function(){
    game.updateTimer(this);
  }, 100);

  //Initialize the game
  game.init();

};