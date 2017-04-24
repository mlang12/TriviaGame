window.onload = function(){

  //Declare variables that will be tied to parts of the DOM
  var category = document.getElementById("category");
  var question = document.getElementById("question");
  var a = document.getElementById("a");
  var b = document.getElementById("b");
  var c = document.getElementById("c");
  var d = document.getElementById("d");
  var choices = document.getElementsByClassName("choice");
  var timeDiv = document.getElementById("timerHolder");

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
      ["Category: Countries", "What is the most visited country in the world?", "England", "United States", "Japan", "France", "d"]
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
      //timeDiv
    },

    //The current game timer - default is 25 seconds to answer a question and 5 seconds
    //in between questions
    timer: 250,
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
    mode: "preGame", //modes are: preGame, inQuestion, afterQuestion, endRound

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
      if (game.timer < 90 && game.timer >= 0 ){
        game.displayTimer = "0" + Math.ceil(game.timer/10)
      } else if (game.timer< 0) {
        game.displayTimer = "00" 
      }
      console.log(game.mode)
      game.onTick(game.mode)
    },

    //This function does checks on every 'tick' of the game time to watch for game state changes
    //and make calls and updates variables as appropriate.
    onTick: function(mode){
      if(mode === "preGame"){
        this.display.category.innerHTML = "Push the button to get started.";
        this.display.question.innerHTML =  "Welcome to GeoTrivia";
        this.display.a.innerHTML = "Let's Play!";
        this.display.b.style.display = "none";
        this.display.c.style.display = "none";
        this.display.d.style.display = "none";
      }
      
      if(mode === "inQuestion"){
        var _this = this
        i = 0
        timeDiv.style.visibility = "visible";
        
        Object.keys(this.display).forEach(function(el){
          _this.display[el].innerHTML = _this.question[_this.currentQuestion][i];
          _this.display[el].style.display = "block";
          if(el.length === 1 ){
            _this.display[el].className = "choice";
          }
          i++;
        });
        
        timeDiv.innerHTML = this.displayTimer;
      

        if(this.timer <= 0 ){
          this.mode = "afterQuestion";
          this.scoreboard.losses++;
          this.message = "Out of time!";
          this.timer = 30;
          this.remainingQuestions--;
        }

        timeDiv.innerHTML = this.displayTimer;
      }
      
      if(mode === "afterQuestion"){
        timeDiv.innerHTML = this.message
        
        if (this.timer <= 0) {
          this.mode = "inQuestion";
          this.timer = 250;
          this.currentQuestion = this.getNewQuestion();
        }

        if (this.remainingQuestions === 0){
          this.mode = "endRound";
          this.remainingQuestions = this.questionsPerRound;
          this.scoreboard.totalWins += this.scoreboard.wins;
          this.scoreboard.totalLosses += this.scoreboard.losses;
        }
      }
      
      if(mode === "endRound"){
        this.message = "Round Complete. <br> " + this.scoreboard.totalWins + " total correct. <br>" + this.scoreboard.totalLosses + " total wrong."
        this.display.category.innerHTML = "Round Complete";
        this.display.question.innerHTML =  "You got " + this.scoreboard.wins + " correct <br> and " + this.scoreboard.losses + " wrong.";
        this.display.a.innerHTML = "Next Round";
        this.display.a.className = "choice";
        this.display.b.style.display = "none";
        this.display.c.style.display = "none";
        this.display.d.style.display = "none";
        timeDiv.innerHTML = this.message;
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
        this.timer = 250;
        return;
      }

      if (game.mode === "inQuestion"){
        //If the user picks the correct option
        if(this.question[this.currentQuestion][this.question[this.currentQuestion].length-1] === el){
          this.scoreboard.wins ++;
          this.display[el].className = "choice correct";
          this.message = "Correct!";
        } else { //If the user didn't make the correct selection
          this.scoreboard.losses ++;
          this.display[el].className = "choice incorrect";
          this.display[this.question[this.currentQuestion][this.question[this.currentQuestion].length-1]].className = "choice correct";
          this.message = "Sorry, not correct...";
        }

        //Change the game mode, reset timer to 'in-between questions time limit' reduce the amount of questions in round
        this.mode = "afterQuestion";
        this.timer = 30;
        this.remainingQuestions --;
        return;
      }

      if (game.mode === "endRound"){
        game.mode = "inQuestion";
        this.scoreboard.wins = 0;
        this.scoreboard.losses = 0;
        return;
      }

    },

    //Returns a new quesiton from the library that wasn't already played
    getNewQuestion: function(){
      var tempnum = Math.floor(Math.random() * this.question.length);
      while((this.pastQuestions.indexOf(tempnum) > -1) && (this.pastQuestions.length !== this.question.length)){
        tempnum = Math.floor(Math.random() * this.question.length);
      }
      return tempnum;
    }


  } //Close Game Obj
  var cancelInterval = setInterval(game.updateTimer, 100);
  game.init(choices);

}();