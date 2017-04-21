$(document).ready(function(){
  var main = document.getElementById("main")
  var question = document.getElementById("a")
  var i = 0;

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

    init: function() {

    },

    redraw: function(){
      var _this = this
      this.display.forEach(function(el){
        el.innerHTML = _this.question[0][i];
        i++;
      }

    }

  } //Close Game Obj

  game.init()
  game.redraw()


});