// Operation Functions 
const add = function(a,b) {
    return (a+b);
}

const subtract = function(a,b) {
    return (a-b);
}

const multiply = function(a,b) {
    return (a*b);
}

const divide = function(a,b) {
    if (b == 0) return "ERROR";
    return (a/b);
}

const percentage = function(a) {
    return (a/100);
}

const plusminus = function(a) {
    return (a*-1);
}

// Variables for operands and operator
var firstNum = 0;
var secondNum = 0;
var operator = "";

// Operate function 
const operate = function(a,b, operator) {
    if (operator == "+") {
        add(a,b);
    }
    if (operator == "-") {
        subtract(a,b);
    }
    if (operator == "*") {
        multiply(a,b);
    }
    if (operator == "/") {
        divide(a,b);
    }
    if (operator == "^") {
        power(a,b);
    }
}

// Event listeners for each number
const numbers = document.querySelectorAll('.console.number');
const operators = document.querySelectorAll('.console.operator');
const configs = document.querySelectorAll('.console.config');

numbers.forEach( function(currentValue) {
    console.log(currentValue);
    currentValue.addEventListener('click', updateDisplay());
});



// Display function
const populateDisplay = function() {

};