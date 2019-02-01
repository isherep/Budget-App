//============3 MODULES================

//************UI********************
var UIController = (function(){
 /* - get input values
   - add new info to ui
   - update ui
*/ 
//assign variables to html input fields
     var DOMStrings  = function() {

        type : 'add__type';
        desc :'add__description';  
        value: 'add__value';     

     }
    
    return {
        //returning object containing object
        getinput: function() {
            return {
                type: document.querySelector(type).value,
                desc:  document.querySelector(desc).value, 
                value: document.querySelector(value).value   
            }
        }
    }

})();


//********DATA MODULE - BUDGET CONTROL***************************
//IEFE - anonnimous
var budgetController = (function(){
    
 //   
    
    
    
})();



//************APP CONTROLLER************
var controller = (function(UIController, budgetController){
    
    var ctrlAddItem = function (){
     //1. Get the fiesl input data
    var input = UIController.getinput();
        console.log(input);
          //2. Add item to budget controller
          //3. Add item to UI
          //4. Calculate the budget
           //5. Display the budger      
    }
 //  set up event listener to add button - click and Enter
    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

      //Key event listener is added to global doc
    document.addEventListener('keypress', function(event){
        if(event.keyCode ===13 || event.which === 13){
           ctrlAddItem();  
     }   
})      
    
})();

