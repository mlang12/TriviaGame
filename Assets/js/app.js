window.onload = function(){

  //Declare variables that will be tied to parts of the DOM
  var category = document.getElementById("category");
  var question = document.getElementById("question");
  var a = document.getElementById("a");
  var b = document.getElementById("b");
  var c = document.getElementById("c");
  var d = document.getElementById("d");
  var choices = document.getElementsByClassName("choice");

  var i = 0;

  //Object containing the trivia game
  var game = {

    //Question property is an array of arrays. Each sub array represents question/answer content
    question: [
      ["States", "What was the first US state?", "Massachusettes", "New Jersey", "Connecticut", "Delaware", "d"],
      ["States", "What is the smallest US state by area?", "Rhode Island", "Hawaii", "New Jersey", "Delaware", "a"],
      ["States", "What is the most populated US state?", "New York", "Texas", "California", "Florida", "c"],
      ["States", "What state has the highest mountain in the US?", "Washington", "Colorado", "Alaska", "Wyoming", "c"]
    ],

    //Contains the variables that refer to the areas of DOM to be
    //updated with every new question and aligns to the question property above
    display: [
      category,
      question,
      a,
      b,
      c,
      d
    ],

    //The current game timer - default is 25 seconds to answer a question and 5 seconds
    //in between questions
    timer: "25",

    //Current question number
    currentQuestion: 0,

    //Past Questions
    pastQuestions: [],

    init: function(answerButtons) {

      //Add listener to each possible answer
      i = 0
      for(; i < answerButtons.length ; i++ ){
        answerButtons[i].addEventListener("click", function(el){
          game.select(el.toElement.id)
        })
      }

      this.currentQuestion = this.getNewQuestion()
      this.redraw()
    },

    select: function(el){
      if(this.question[this.currentQuestion][this.question[this.currentQuestion].length-1] === el){
        console.log("correct", el)
        this.pastQuestions.push(this.currentQuestion);
        this.currentQuestion = this.getNewQuestion()
        this.redraw()
      } else {
        console.log("wrong", el)
      }
    },

    getNewQuestion: function(){
      var tempnum = 0;
      
      while((this.pastQuestions.indexOf(tempnum) > -1) && (this.pastQuestions.length !== this.question.length)){
        console.log("blah")
        tempnum = Math.floor(Math.random() * this.question.length);
      }

      return tempnum;

    },

    redraw: function(){
      var _this = this
      i = 0
      this.display.forEach(function(el){
        el.innerHTML = _this.question[_this.currentQuestion][i];
        i++;
      });
    }

  } //Close Game Obj

  game.init(choices)

}();