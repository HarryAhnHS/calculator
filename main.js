// Operation Functions 
const add = function(a,b) {
    return Number((a-b).toPrecision(15));
}
const subtract = function(a,b) {
    return Number((a-b).toPrecision(15));
}
const multiply = function(a,b) {
    return Number((a*b).toPrecision(15));
}
const divide = function(a,b) {
    if (b == 0) return "ERROR";
    return Number((a/b).toPrecision(15));
}
const percentage = function(a) {
    return Number((a/100).toPrecision(15));
}
const plusminus = function(a) {
    return Number((a*-1).toPrecision(15));
}

console.log(percentage(0.99));
// Variables for operands and operator
var operandLeft_ = NaN;
var operandRight_ = NaN;
var operator_ = "";

// Operate function 
const operate = function(a,b, operator) {
    if (operator == "+") {
        return add(a,b);
    }
    if (operator == "-") {
        return subtract(a,b);
    }
    if (operator == "x") {
        return multiply(a,b);
    }
    if (operator == "/") {
        return divide(a,b);
    }
}

// Helper function to determine how many non-significant zeros
const numNonSigZeroes = function(n) {
    const digits = n.toString().split('');
    let i = 0; 
    while (digits[i] == '0' || digits[i] == '.') {
        i++;
    }
    return i-1;
};

numNonSigZeroes(0.0000023);

// Display Configuration
const display = document.querySelector('.calc-display-number');

// Append n to end of current display
const populateDisplay = function(n) {
    // Display n, but use scientific notation is length > 12, or round to fit display (12 chars) if decimal
    if (n.toString().length>12) {
        console.log(n.toString().length);
        console.log(n);
        if (n>=0) {
            if (n > 999999999999 || (n <= 0.0000001 && n > 0)) {
                // Scientific notation
                display.textContent = n.toExponential(4);
            }
            else if (n < 1 && n > 0) {
                const nonSigZeroes = numNonSigZeroes(n);
                display.textContent = n.toPrecision(11-nonSigZeroes);
            } 
            else {
                display.textContent = n.toPrecision(11);
            }
        }
        else { // Negative values
            if (n < -99999999999 || (n >= -0.0000001 && n < 0)) {
                // Scientific notation
                display.textContent = n.toExponential(4);
            }
            else if (n > -1 && n < 0) {
                const nonSigZeroes = numNonSigZeroes(n);
                display.textContent = n.toPrecision(10-nonSigZeroes);
            } 
            else {
                display.textContent = n.toPrecision(10);
            }

        }
    }
    else {
        display.textContent = n;
    }
};

// Clear display {
const clearDisplay = function() {
    display.textContent = "";
};

// Convert display to float value for internal calculation
const displayToFloat = function() {
    return parseFloat(display.textContent.replace(/\s+/g, ''));
}

// Reset Calculator
const resetCalc = function() {
    clearDisplay();
    operandLeft_ = 0;
    operandRight_ = 0;
    operator_ = "";
}

// Event listeners for each number
const numbers = document.querySelectorAll('.console.number');
const operators = document.querySelectorAll('.console.operator');
const configs = document.querySelectorAll('.console.config');


// ****** TO-DO - ADD KEYBOARD FUNCTIONALITY
numbers.forEach( function(number) {
    number.addEventListener('click', e => {
        // Clear if display is currently operator
        if (display.textContent == '+' || display.textContent == '-' || display.textContent == 'x' || display.textContent == '/') {
            clearDisplay();
        }
        // Edgecase - only 12 char fit at input panel (MONOSPACE FONT)
        if (display.textContent.replace(/\s+/g, '').length < 12) {
            // Edgecase- only one . allowed in display
            if (number.textContent == '.') {
                if (!display.textContent.includes('.') && display.textContent.replace(/\s+/g, '').length > 0) {
                    display.textContent = display.textContent.replace(/\s+/g, '')+number.textContent;
                }
            }
            else {
                display.textContent = display.textContent.replace(/\s+/g, '')+number.textContent;
            }
        }
    });
});

operators.forEach( function(operator) {
    operator.addEventListener('click', e => { 
        if (operator.textContent == '=') {
            if (operator_ != "" && operator_ != "=") {
                operandRight_ = displayToFloat();
                clearDisplay();
                console.log(`${operandLeft_} ${operator_} ${operandRight_} = ${operate(operandLeft_,operandRight_,operator_)}`);
                populateDisplay(operate(operandLeft_,operandRight_,operator_));
                operator_ = "=";
            }
        }
        else {
            if (display.textContent.length > 0) { // If display is not empty 
                if (operator_ == "=" || operator_ == "") {
                    operator_ = operator.textContent; // set operator_ global variable for evaluation
                    operandLeft_ = displayToFloat(); // set current to left operand global var
                    clearDisplay();
                    populateDisplay(operator.textContent);
                }
                // Edgecase - chain operations without pressing '=' 
                // ***** WORKING, but does not display chained answers, only store back end until "="
                // ********* TODO-don't display operators, but change background color of button to show active state
                else {
                    // Don't run equation if display is currently at operator, so that operand can switch 
                    if (display.textContent != '+' && display.textContent != '-' && display.textContent != 'x' && display.textContent != '/') {
                        operandRight_ = displayToFloat();
                        clearDisplay();
                        populateDisplay(operator.textContent);
                        console.log(`${operandLeft_} ${operator_} ${operandRight_} = ${operate(operandLeft_,operandRight_,operator_)}`);
                        operandLeft_ = operate(operandLeft_,operandRight_,operator_);
                        operator_ = operator.textContent;
                    } 
                    else { // If display is currently operator, switch to new operator clicked
                        operator_ = operator.textContent; // set operator_ global variable for evaluation
                        clearDisplay();
                        populateDisplay(operator.textContent);
                    }
                }
            }
        }
    })
})


// *****TO-DO - INCLUDE CONFIG FUNCTIONS
configs.forEach( function(config) {
    config.addEventListener('click', e => { 
        if (display.textContent.length > 0) { 
            if (config.textContent == "AC") {
                resetCalc();
            }
            else if (config.textContent == "+/-") {
                const ret = plusminus(displayToFloat(display.textContent));
                populateDisplay(ret);
            }
            else if (config.textContent == "%") {
                const ret = percentage(displayToFloat(display.textContent));
                populateDisplay(ret);
            }
        }
    })
});

