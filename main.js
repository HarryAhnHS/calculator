// Operation Functions 
const add = function(a,b) {
    return a+b;
}

const subtract = function(a,b) {
    return a-b;
}

const multiply = function(a,b) {
    return (a*b);
}

const divide = function(a,b) {
    if (b == 0) return "ERROR";
    return (a/b);
}

const power = function(a,b) {
    return (Math.pow(a,b));
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