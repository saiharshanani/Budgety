// module pattern
// The tasks are divided into the 3 controller components - budgetController,uiController,appController
var BudgetController = (function () {
    // function constructor for Expense
    var Expense = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };
    
    Expense.prototype.getPercentages = function () {
        return this.percentage;
        
    }

    // function constructor for Income
    var Income = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    };



    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    };

    // object data structure for storing values
    var data = {
        // object ds for allItems and totals
        allItems : {
            exp: [],
            inc: []
        },
        totals : {
            exp: 0,
            inc: 0
        },
        budget : 0,
        percentage:-1
    };
    // returning it for the other modules
    return {
        //object ds for addItem
        addItem: function (type,desc,val){
            var newItem,ID;
            if (data.allItems[type].length>0){
                ID = data.allItems[type][data.allItems[type].length-1].id+1;
            } else {
                ID = 0;
            }
            // create a new item based on type
            if (type === "exp"){
                newItem = new Expense(ID,desc,val);
            } else if (type === "inc")
            {
                newItem = new Income(ID,desc,val);
            }
            // adding the item to our data structure
            data.allItems[type].push(newItem);
            // returning newItem for other modules to display on the UI
            return newItem;
        },

        deleteItem : function(type,id){

            ids = data.allItems[type].map(function (current){
                return current.id;
            });
            index = ids.indexOf(id);
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function(){
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            data.budget = data.totals.inc - data.totals.exp;
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentage: function(){
            data.allItems.exp.forEach(function (current) {
                current.calcPercentage(data.totals.inc);
            });

        },

        getPercentages : function(){
            var allPerc = data.allItems.exp.map(function (cur) {
                return cur.getPercentages();
            });
            return allPerc;
        },

        getBudget: function(){
            return {
                budget : data.budget,
                totalInc : data.totals.inc,
                totalExp: data.totals.exp,
                percentage : data.percentage
            }
        },

        testing : function f() {
            console.log(data);
        }

    };

})();

var UIController = (function () {
    // Domstrings for easiness
    var DomStrings = {
        inputType : ".add__type",
        inputDescription : ".add__description",
        inputValue : ".add__value",
        inputbutton:".add__btn",
        incomeContainer:".income__list",
        expenseContainer:".expenses__list",
        budgetLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expensesLabel:".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage",
        container: ".container",
        expensesPercentageLabel:".item__percentage",
        dateLabel:".budget__title--month"
    };
    var formatNumber = function(num,type){

        /*
        + or - for num type
        exactly 2 decimal points
        comma seperating the thousands

        1245.8970 -> + 1,245.89
         */

        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split(".");
        int = numSplit[0];
        if (int.length > 3){
            int = int.substr(0,int.length - 3) + " , " + int.substr(int.length - 3,3);
        }
        dec = numSplit[1];

        return (type === "exp" ? "-": "+") +" "+int+ "." +dec;


    };

    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    // returning for making it public for other modules
    return {
        //getting values from the textbox fields
        getInput: function () {
            return {
                type : document.querySelector(DomStrings.inputType).value, // Inc -> Income,exp -> expenses
                description : document.querySelector(DomStrings.inputDescription).value,
                value : Number(document.querySelector(DomStrings.inputValue).value),
            };
        },
        addListItem : function(obj,type){
            var html,newHtml;
            // create HTML string with placeholder
            if (type === "inc"){
                element = DomStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div ' +
                'class="right clearfix"> <div class="%item__value%">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i ' +
                'class="ion-ios-close-outline"> </i></button> </div> </div> </div>';
            } else if (type === "exp") {
                element = DomStrings.expenseContainer;
                html =  '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div ' +
                'class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div ' +
                'class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
            }

            // Replace the placeholder text with some actual data

            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace("%description%",obj.description);
            newHtml = newHtml.replace("%value%",formatNumber(obj.value,type));

            // Insert the HTML into the DOM

            document.querySelector(element).insertAdjacentHTML("beforeend",newHtml);

        },

        deleteListItem: function(selectorID){
            var element = document.getElementById(selectorID);
            element.remove();
        },
        // to clear the input fields
        clearInputFields : function (){
            var fields,fieldsArr;
            //selecting values and description
            fields = document.querySelectorAll(DomStrings.inputDescription + ', ' + DomStrings.inputValue);
            // fields.slice() // converting list to array for applying methods
            fieldsArr = Array.prototype.slice.call(fields); // the above slice modified
            //looping through fieldArr
            fieldsArr.forEach(function(current,index,array) {
                current.value = "";
            });
            fieldsArr[0].focus();

        },

        displayBudget: function(obj){
            var type;
            obj.budget > 0 ? type = "inc" : type = "exp";
            document.querySelector(DomStrings.budgetLabel).textContent = formatNumber(obj.budget,type);
            document.querySelector(DomStrings.incomeLabel).textContent = formatNumber(obj.totalInc,"inc");
            document.querySelector(DomStrings.expensesLabel).textContent = formatNumber(obj.totalExp,"exp");
            if (obj.percentage > 0) {
                document.querySelector(DomStrings.percentageLabel).textContent = obj.percentage;
            } else {
                document.querySelector(DomStrings.percentageLabel).textContent = "--";
            }

        },
        displayPercentages : function(percentages){
            var fields = document.querySelectorAll(DomStrings.expensesPercentageLabel);
            nodeListForEach(fields, function(current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });

        },

        displayMonth : function(){
            var year,now,month;
            now = new Date();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            year = now.getFullYear();
            month = now.getMonth();
            document.querySelector(DomStrings.dateLabel).textContent = months[month] + " " + year;

        },
        changedType : function(){
            var fields = document.querySelectorAll(
                DomStrings.inputType + ',' +
                DomStrings.inputDescription + ',' +
                DomStrings.inputValue);

            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DomStrings.inputbutton).classList.toggle('red');

        },
        getDomstrings : function () {
            return DomStrings;
        }
    };
})();

var AppController = (function (budgetCtrl,uiCtrl) {
    // Event triggering
    var setupEventListeners = function () {

        var Dom = uiCtrl.getDomstrings();
        document.querySelector(Dom.inputbutton).addEventListener("click",addItemCtrl);
        document.addEventListener("keypress",function(e){
            if (e.keyCode === 13 || e.which ===13){
                addItemCtrl();
            }
        });

        document.querySelector(Dom.container).addEventListener("click",deleteItemCtrl);
        document.querySelector(Dom.inputType).addEventListener("change",uiCtrl.changedType);

    };

    var updateBudget = function () {

        budgetCtrl.calculateBudget();
        var budget = budgetCtrl.getBudget();
        uiCtrl.displayBudget(budget);

    };

    var updatePercentages = function () {
        // calculate the percentages
        budgetCtrl.calculatePercentage();

        // read from the budgetcontroller
        var percentages = budgetCtrl.getPercentages();

        //update the ui
        uiCtrl.displayPercentages(percentages);
    };

    var addItemCtrl = function(){
        var input,newItem;

        // Get Input data
        input = uiCtrl.getInput();
        if (input.description !== "" && !isNaN(input.value) && input.value > 0 ) {
            // Add item to the budget controller,holds the returned new item
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            // Add the new item to the interface
            uiCtrl.addListItem(newItem, input.type);
            //clearing the input fields
            uiCtrl.clearInputFields();
            updateBudget();
            updatePercentages();
        } else { alert("enter valid inputs") }

    };
    
    var deleteItemCtrl = function (event) {
        var itemID, splitID,type,ID;
        event = event.target;

        while(event.classList && !event.classList.contains('item')){
            event = event.parentNode;
        }
        itemID = event.id;

        if(itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //delete from budget control

            budgetCtrl.deleteItem(type,ID);

            // delete from UI

            uiCtrl.deleteListItem(itemID);

            //calcuate budget
            updateBudget();

            //update percentages
            updatePercentages();
        }
    };

    return {
        //init function to call the eventlisteners at the start
        init: function () {
            console.log("Application has started");
            uiCtrl.displayMonth();
            uiCtrl.displayBudget({
                budget : 0,
                totalInc : 0,
                totalExp: 0,
                percentage : -1}
                );
            setupEventListeners();

        }
    };

})(BudgetController,UIController);

AppController.init();