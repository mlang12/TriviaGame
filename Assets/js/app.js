window.onload = function(){

  //Declare variables that will be tied to parts of the DOM
  var category = document.getElementById("category");
  var question = document.getElementById("question");
  var a = document.getElementById("a");
  var b = document.getElementById("b");
  var c = document.getElementById("c");
  var d = document.getElementById("d");
  var choices = document.getElementsByClassName("choice");
  var msgHolder = document.getElementById("msgHolder");
  var board = document.getElementById("main")

  var i = 0;

  //Object containing the trivia game
  var game = {

    //Question property is an array of arrays. Each sub array represents question/answer content
    question: [
      ["Category: States", "What was the first US state?", "Massachusettes", "New Jersey", "Connecticut", "Delaware", "d"],
      ["Category: States", "What is the smallest US state by area?", "Rhode Island", "Hawaii", "New Jersey", "Delaware", "a"],
      ["Category: States", "What is the most populated US state?", "New York", "Texas", "California", "Florida", "c"],
      ["Category: States", "What state has the highest mountain in the US?", "Washington", "Colorado", "Alaska", "Wyoming", "c"],
      ["Category: Countries", "What is the largest country by area?", "China", "Russia", "United States", "Canada", "b"],
      ["Category: Countries", "What country has the largest population?", "Russia", "India", "United States", "China", "d"],
      ["Category: Countries", "What is the largest island by area that is also a country?", "Australia", "Madigascar", "Indonesia", "Japan", "c"],
      ["Category: Countries", "What is the most visited country in the world?", "England", "United States", "Japan", "France", "d"],
      ["Category: Bodies of Water", "What is the longest river in the world?", "Amazon", "Nile", "Mississippi", "Hudson", "a"],
      ["Category: Bodies of Water", "What is the biggest lake in the world?", "Superior", "Caspian", "Huron", "Victoria", "b"],
      ["Category: Bodies of Water", "What is the smallest ocean?", "Arctic", "Indian", "Atlantic", "Pacific", "a"],
      ["Category: Bodies of Water", "Which of the following is not a sea?", "Mediterranean", "Caribean", "Black", "Bangoo", "d"]
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

    updateTimer: function(){
      game.timer --
      game.displayTimer = String(Math.ceil(game.timer/10));
      if (game.timer <= 90 && game.timer >= 0 ){
        game.displayTimer = "0" + Math.ceil(game.timer/10)
      } else if (game.timer< 0) {
        game.displayTimer = "00" 
      }
      game.onTick(game.mode); //Updates game based on the game mode
    },

    //This function does checks on every 'tick' of the game time to watch for game state changes
    //and make calls and updates variables as appropriate.
    onTick: function(mode){
            //if there are no more questions show the end of questions screen and allow user to reset game
      if(this.pastQuestions.length >= this.question.length){
        this.message = "Total Correct: " + this.scoreboard.totalWins + 
          "<br> Total Wrong: " + this.scoreboard.totalLosses 
        this.mode = "outOfQuestions"
        this.display.category.innerHTML = "Push the button to reset the game.";
        this.display.question.innerHTML =  "Oops we ran out of questions!";
        this.display.a.innerHTML = "Reset";
        this.displayMode()
        return;
      }

      //When the game is in preGame mode (on load)
      if(mode === "preGame"){
        this.display.category.innerHTML = "Push the button to get started.";
        this.display.question.innerHTML =  "Welcome to GeoTrivia";
        this.display.a.innerHTML = "Let's Play!";
        this.displayMode()
        return
      }
      
      //When the user is currently "in a question" and computer awaiting input
      if(mode === "inQuestion"){
        var _this = this
        i = 0
        
        //Update the gameboard with items of the current question
        Object.keys(this.display).forEach(function(el){
          _this.display[el].innerHTML = _this.question[_this.currentQuestion][i];
          if(el.length === 1 ){
            _this.display[el].className = "choice"; //resets the class names to clear formats from correct/incorrect answers
          }
          i++;
        });
        board.className = "row boardBg";
        this.displayMode()

        //When the timer hits zero and user hasn't made a guess
        if(this.timer <= 0 ){
          this.mode = "afterQuestion";
          this.scoreboard.losses++;
          this.message = "Out of time! <br> The right answer was \"" 
            + this.question[this.currentQuestion][this.question[this.currentQuestion].length-1].toUpperCase()
            + "\""
          this.timer = 30;
          this.remainingQuestions--;
          this.display[this.question[this.currentQuestion][this.question[this.currentQuestion].length-1]].className = "choice missedGuess";
          board.className = "row boardWrong"
        }

        msgHolder.innerHTML = this.displayTimer; //Update the timer
        return;
      }
      
      //If the game is "after a question" in the brief period in between questions
      if(mode === "afterQuestion"){
        msgHolder.innerHTML = this.message
        
        if (this.timer <= 0 && this.remainingQuestions >= 1) {
          this.mode = "inQuestion";
          this.timer = 100;
          this.pastQuestions.push(this.currentQuestion);
          this.currentQuestion = this.getNewQuestion();
        }

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
      
      //If the current round is over
      if(mode === "endRound"){
        board.className = "row boardBg";
        this.message = this.scoreboard.totalWins + 
          " total correct. <br>" + this.scoreboard.totalLosses + " total wrong."
        this.display.category.innerHTML = "Round Complete";
        this.display.question.innerHTML =  "You got " + this.scoreboard.wins + 
          " correct <br> and " + this.scoreboard.losses + " wrong.";
        this.display.a.innerHTML = "Next Round";
        this.display.a.className = "choice";
        this.displayMode();
        return;
      }
  
    },

    init: function(answerButtons) {
      //Add listener to each possible answer
      i = 0
      for(; i < answerButtons.length ; i++ ){
        answerButtons[i].addEventListener("click", function(el){
          game.select(el.toElement.id);
        })
      }
      this.currentQuestion = this.getNewQuestion();
      this.mode = "preGame";
    },

    select: function(el){
      if (game.mode === "preGame"){
        game.mode = "inQuestion";
        this.timer = 100;
        return;
      }

      if (game.mode === "inQuestion"){
        //If the user picks the correct option
        if(this.question[this.currentQuestion][this.question[this.currentQuestion].length-1] === el){
          this.scoreboard.wins ++;
          this.display[el].className = "choice correct";
          this.message = "Correct!";
          board.className = "row boardCorrect"
        } else { //If the user didn't make the correct selection
          this.scoreboard.losses ++;
          this.display[el].className = "choice incorrect";
          board.className = "row boardWrong"
          this.display[this.question[this.currentQuestion][this.question[this.currentQuestion].length-1]].className = "choice missedGuess";
          this.message = "Sorry, the right answer was \"" 
            + this.question[this.currentQuestion][this.question[this.currentQuestion].length-1].toUpperCase()
            + "\"";
        }

        //Change the game mode, reset timer to 'in-between questions time limit' reduce the amount of questions in round
        this.mode = "afterQuestion";
        this.timer = 30;
        this.remainingQuestions --;
        return;
      }

      //If the round is over then there is only 1 button to click which will move into next round
      if (game.mode === "endRound"){
        game.mode = "inQuestion";
        this.timer = 100;
        this.scoreboard.wins = 0;
        this.scoreboard.losses = 0;
        return;
      }

      //If the game is out of questions, the button will reset the game
      if(this.mode === "outOfQuestions"){
        this.mode = "preGame"
        this.scoreboard.wins = 0;
        this.scoreboard.losses = 0;
        this.scoreboard.totalWins = 0;
        this.scoreboard.totalLosses = 0;
        this.pastQuestions = [];
        this.message = ""
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

    //This function is called during certain redraws (usually from onTick) and sets certain elements
    //to display or not and updates the msgHolder element
    displayMode: function(){
      if(this.mode === "inQuestion" || this.mode === "afterQuestion"){
        this.display.b.style.display = "block";
        this.display.c.style.display = "block";
        this.display.d.style.display = "block";

      }
      
      if(this.mode === "preGame" || this.mode === "outOfQuestions" || this.mode === "endRound"){
        this.display.b.style.display = "none";
        this.display.c.style.display = "none";
        this.display.d.style.display = "none";
      }

      msgHolder.innerHTML = this.message
    }
  } //Close Game Obj
  var cancelInterval = setInterval(game.updateTimer, 100);
  game.init(choices);

}();