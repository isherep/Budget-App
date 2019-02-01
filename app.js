//============3 MODULES================

//==========DATA MODULE - BUDGET CONTROL=================


var budgetController = (function() {
    
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
       
    };
    
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    //helper function for calculate budget
    var calculateTotal = function(type){
        
        var sum = 0;
        
        data.allItems[type].forEach(function (cur){
            sum = sum + cur.value;
        }); 
        data.totals[type] = sum;
    };
    //creating object to store all data instead of separate arrays
    var data = {
       allItems: {
           exp: [],
           inc:[]
       }, 
        totals: {
           exp: 0,
           inc: 0
       },
        budget: 0,
        percentage: -1
    };
    //return Object which will contain all public methods
    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            
            //ID = last ID + 1
            
            //Create new ID
            
            if(data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            
            //Create new item based on 'inc' or 'exp' type
            if(type ==='exp') {
                newItem = new Expense(ID, des, val);
            } else if(type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            //Push it into our data structure
            data.allItems[type].push(newItem);
            
            //Return new element
            return newItem;
        },
        
        calculateBudget : function() {
            //Calculate sum of all incomes
            
            calculateTotal('exp');
            calculateTotal('inc');
            
            //Calculate sum of all expences
            
            //Calsulate budget: income - expenses
            
            data.budget = data.totals.inc - data.totals.exp;
            
            //Calculate %' s of income and expences
            if(data.totals.inc > 0){
            data.percentage = Math.round((data.totals.exp/data.totals.inc) * 100);
            }else {
                data.percentage = -1;
            }
        },
        
        getBudget: function() {
            return {
                
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage,
            };
        },
        //test to see in a console
        testing: function() {
            console.log(data);
        }
    };
     
})();

 



//===============UI=====================
var UIController = (function(){
 /* - get input values
   - add new info to ui
   - update ui
*/
//assign variables to html input fields
     var DOMstrings  = {

        type : '.add__type',
        desc :'.add__description',  
        value: '.add__value' ,
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage'

     };
    
    
        //returning object containing object

    return {
        getinput: function() {
            return {
                type: document.querySelector(DOMstrings.type).value,
                desc:  document.querySelector(DOMstrings.desc).value, 
                value: parseFloat(document.querySelector(DOMstrings.value).value),
                inputBtn: document.querySelector(DOMstrings.inputBtn).value   
            };
        },
        
        addListItem: function(obj, type) {
            var html, newHTML
            
            //create html string with some placeholder text
            
            if(type === 'inc'){
                
            element = DOMstrings.incomeContainer;
                
            html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div></div></div>';
            
            } else if (type === 'exp'){
                element = DOMstrings.expensesContainer;
                
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">10%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                
            }
            //Replace placeholder text with actual data, usings strings methods
            
            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', obj.value);
            
            //Insert html into the DOM
            
            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
            
        },
        
        clearFields: function() {
            var fields;
            
            fields = document.querySelectorAll(DOMstrings.desc + ',' + DOMstrings.value);
            //turning the result of selection from list to array
            fieldsArr = Array.prototype.slice.call(fields);
            //pass callback function to for each - in our case anonimous - can re
            //receive up to 3 parameters . Current array
            
            //What we want to do in this method - clear all fieslds
            fieldsArr.forEach( function (currentEl, index, array) {
                
                currentEl.value = "";
                
            });
            
            fieldsArr[0].focus();
        },
        
        displayBudget: function(obj) {
            //budget, total income, total expense and percentage
            //we need to add more strings to DOM object
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
           
                        
            if(obj.percentage > 0){
                 document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },
        
      getDOMstrings : function() {
          return DOMstrings;
      }  
    };

})();


//================APP CONTROLLER*=====================
var controller = (function(UIController, budgetController){
    
    var setupEventListeners = function () {
        var DOM = UIController.getDOMstrings();
        
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

      //Key event listener is added to global doc
        document.addEventListener('keypress', function(event){
            if(event.keyCode ===13 || event.which === 13){
               ctrlAddItem();  
            }   
        });  
    }
    
    var input, newItem;
    
    
    var updateBudget = function() {
        
        //1. Calculate the budget
        budgetController.calculateBudget();
        // 2. Returns a budget
        var budget = budgetController.getBudget();
        
           //3. Display the budget 
        UIController.displayBudget(budget);
    }
    
    var ctrlAddItem = function (){
     //1. Get the fiesl input data
        input = UIController.getinput();
              if(input.desc !== "" && !isNaN(input.value) && input.value > 0){  
                  //2. Add item to budget controller
        newItem = budgetController.addItem(input.type, input.desc, input.value);
                  //3. Add item to UI
        UIController.addListItem(newItem, input.type);

                //4. Clear the fields
        UIController.clearFields();

                  //4. Calculate the budget

                   //5. Display the budget
        updateBudget();
          }
    };
    
    return{
        init:function() {
            console.log('Application started');
            UIController.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };
 //  set up event listener to add button - click and Enter
         
})(UIController, budgetController);


controller.init();
