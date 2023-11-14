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


// Display Configuration
const display = document.querySelector('.calc-display-number');

// Append n to end of current display
const populateDisplay = function(n) {
    // Display function
    display.textContent = (display.textContent.replace(/\s+/g, '')+n)
};

// Convert display to float value for internal calculation
const displayToFloat = function() {
    return parseFloat(display.textContent.replace(/\s+/g, ''));
}

// Event listeners for each number
const numbers = document.querySelectorAll('.console.number');
const operators = document.querySelectorAll('.console.operator');
const configs = document.querySelectorAll('.console.config');

numbers.forEach( function(number) {
    number.addEventListener('click', e => {
        // Edgecase - only 12 char fit inside display panel (MONOSPACE FONT)
        if (display.textContent.replace(/\s+/g, '').length <= 12) {
            // Edgecase- only one . allowed in display
            if (number.textContent == '.') {
                if (!display.textContent.includes('.')) {
                    display.textContent = display.textContent.replace(/\s+/g, '')+number.textContent;
                }
            } 
            else {
                display.textContent = display.textContent.replace(/\s+/g, '')+number.textContent;
            }
        }        
    });
});




