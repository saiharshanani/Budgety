# Budgety

#### What is Budgety ?<br/>
Budgety is a web application where an individual can track the available budget for a month depending on updating the income and expenses.

#### Implementation:
The user interface elements are implemented by using HTML and CSS which are divided into:
* Container for a top section which holds:
  * Background image.
  * Displaying available budget for the current month.
  * Displaying total budgets.
  * Displaying total income and expenses.
  
* Container for accepting values:
  * Which has a dropdown with values + and - to select income or expenses respectively.
  * The text holder to add a description for respective costs.
  * The amount of value for an income or expense.
  * Submit button to accept those values

* Container to display Individual value:
  * The income and expenses are individually displayed.
  * A delete button to delete the values.

The functionalities for the interface are implemented by using JavaScript:
#### Tasks:
  * To read, display and delete based on the input values for individual types (income and expenses).
  * To individual calculate the total income and expenses values and display in the DOM elements.
  * Calculating and displaying the total budget based on income and expenses.
  * Calculating the percentages for expenses.

#### Approach:
The Module pattern has been adapted to divide the application into three controller components - BudgetController, UIController, AppController 
Each controller is implemented by IIFE and returns a function to provide the encapsulation.
#### AppController
AppController acts like a medium between UIController and BudgetController which performs update operations like total budget and percentage calculations when an item is added or deleted. 
And also performs input validations and event listener like when "Enter" is pressed or submit button is clicked to accept the values.  
#### UIController
UIController deals with manipulating the HTML DOM elements which include displaying items, calculated budgets and percentages dynamically upon change of every value.
 
#### BudgetController
Budget Controller has two function constructor for Expense and income which handles the id, description values with calculating and getting percentages as prototypes.
The BudgetController is responsible for returning the functions for calculating budget and percentages upon every item operation
  
#### Skills Learnt:
* Dividing the whole functionalities into individual module controllers.
* IIFE for encapsulation.
* Prototype Chain, Hoisting, Scope Chain, Closures, Array Methods - ForEach, Map, DOM Manipulations, Event Delegation - Event Bubbling.
###### Note: This project has been implemented as a part of Udemy - The Complete JavaScript Course 2019: Build Real World Projects
