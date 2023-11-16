// Operation Functions 
const add = function(a,b) {
    return Number((a+b).toPrecision(15));
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

// Display Configuration
const display = document.querySelector('.calc-display-number');

// Append n to end of current display
const populateDisplay = function(n) {
    // Display n, but use scientific notation is length > 12, or round to fit display (12 chars) if decimal
    if (n.toString().length>12) {
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
    operandLeft_ = NaN;
    operandRight_ = NaN;
    operator_ = "";
}

// Event listeners for each number
const numbers = document.querySelectorAll('.console.number');
const operators = document.querySelectorAll('.console.operator');
const configs = document.querySelectorAll('.console.config');


// ****** TO-DO - ADD KEYBOARD FUNCTIONALITY
numbers.forEach(function(number) {
    number.addEventListener('click', e => {
        // reset calculator if number immediately after operation =
        if (operator_ == "=") {
            resetCalc();
        }
        // Clear if display is currently operator
        if (display.textContent == '+' || display.textContent == '-' || display.textContent == 'x' || display.textContent == '/') {
            clearDisplay();
        }
        // Edgecase - only 12 char fit at input panel (MONOSPACE FONT)
        if (display.textContent.replace(/\s+/g, '').length < 12) {
            // Edgecase- only one '.' decimal allowed in display
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
            if (operator_ != "" && operator_ != "=" && display.textContent != '+' && display.textContent != '-' && display.textContent != 'x' && display.textContent != '/') {
                operandRight_ = displayToFloat();
                clearDisplay();
                console.log(`${operandLeft_} ${operator_} ${operandRight_} = ${operate(operandLeft_,operandRight_,operator_)}`);
                populateDisplay(operate(operandLeft_,operandRight_,operator_));
                operator_ = "=";
            }
        }
        else {
            // Change background color 
            operator.classList.add('selected');
            if (operator_ == "=" || operator_ == "") {
                // EDGECASE - IF '-' PRESSED AT RESET STATE, THEN ALLOW NEGATIVE INPUT 
                if (operator_ == "" && Number.isNaN(operandLeft_)&& operator.textContent != '*' && operator.textContent != '/') {
                    operator_ = operator.textContent; // set operator_ global variable for evaluation
                    operandLeft_ = 0; // set current to left operand global var
                    clearDisplay();
                    populateDisplay(operator.textContent);
                    operandRight_ = NaN;
                }
                else {
                    operator_ = operator.textContent; // set operator_ global variable for evaluation
                    operandLeft_ = displayToFloat(); // set current to left operand global var
                    clearDisplay();
                    populateDisplay(operator.textContent);
                    operandRight_ = NaN;
                }
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
                    operandRight_ = NaN;
                } 
                else { // If display is currently operator, switch to new operator clicked
                    operator_ = operator.textContent; // set operator_ global variable for evaluation
                    clearDisplay();
                    populateDisplay(operator.textContent);
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


// KEYBOARD FUNCTIONALITY

window.addEventListener('keydown', function(e) {
    // NUMBER KEY FUNCTIONALITY
    console.log(e.key);
    if (parseInt(e.key) || e.key == "0" || e.key == ".") {
        e.preventDefault();
        // reset calculator if number immediately after operation =
        if (operator_ == "=") {
            resetCalc();
        }
        // Clear if display is currently operator
        if (display.textContent == '+' || display.textContent == '-' || display.textContent == 'x' || display.textContent == '/') {
            clearDisplay();
        }
        // Edgecase - only 12 char fit at input panel (MONOSPACE FONT)
        if (display.textContent.replace(/\s+/g, '').length < 12) {
            // Edgecase- only one '.' decimal allowed in display
            if (e.key == '.') {
                if (!display.textContent.includes('.') && display.textContent.replace(/\s+/g, '').length > 0) {
                    display.textContent = display.textContent.replace(/\s+/g, '')+e.key;
                }
            }
            else {
                display.textContent = display.textContent.replace(/\s+/g, '')+e.key;
            }
        }
    }
    // OPERATORS KEY FUNCTIONALITY
    if (e.key == "/" || e.key == "+" || e.key == "-" || e.key == "*" || e.key == "Enter") {
        e.preventDefault();
        if (e.key == 'Enter') {
            if (operator_ != "" && operator_ != "=" && display.textContent != '+' && display.textContent != '-' && display.textContent != 'x' && display.textContent != '/') {
                operandRight_ = displayToFloat();
                clearDisplay();
                console.log(`${operandLeft_} ${operator_} ${operandRight_} = ${operate(operandLeft_,operandRight_,operator_)}`);
                populateDisplay(operate(operandLeft_,operandRight_,operator_));
                operator_ = "=";
            }
        }
        else {
            if (operator_ == "=" || operator_ == "") {
                // EDGECASE - IF '-' PRESSED AT RESET STATE, THEN ALLOW NEGATIVE INPUT 
                if (operator_ == "" && Number.isNaN(operandLeft_) && e.key != '*' && e.key != '/') {
                    operator_ = e.key; // set operator_ global variable for evaluation
                    operandLeft_ = 0; // set current to left operand global var
                    clearDisplay();
                    populateDisplay(e.key);
                    operandRight_ = NaN;
                }
                else {
                    // EDGE CASE FOR KEY - * should be translated to 'x'
                    if (e.key == "*") {
                        operator_ = 'x';
                        operandLeft_ = displayToFloat(); // set current to left operand global var
                        clearDisplay();
                        populateDisplay('x');
                        operandRight_ = NaN;
                    } 
                    else {
                        operator_ = e.key; // set operator_ global variable for evaluation
                        operandLeft_ = displayToFloat(); // set current to left operand global var
                        clearDisplay();
                        populateDisplay(e.key);
                        operandRight_ = NaN;
                    }
                }
            }
            // Edgecase - chain operations without pressing '=' 
            // ***** WORKING, but does not display chained answers, only store back end until "="
            // ********* TODO-don't display operators, but change background color of button to show active state
            else {
                // Don't run equation if display is currently at operator, so that operand can switch 
                if (display.textContent != '+' && display.textContent != '-' && display.textContent != 'x' && display.textContent != '/') {
                    // EDGE CASE FOR KEY - * should be translated to 'x'
                    if (e.key == "*") {
                        operandRight_ = displayToFloat();
                        clearDisplay();
                        populateDisplay('x');
                        console.log(`${operandLeft_} ${operator_} ${operandRight_} = ${operate(operandLeft_,operandRight_,operator_)}`);
                        operandLeft_ = operate(operandLeft_,operandRight_,operator_);
                        operator_ = 'x';
                        operandRight_ = NaN;   
                    }
                    else {
                        operandRight_ = displayToFloat();
                        clearDisplay();
                        populateDisplay(e.key);
                        console.log(`${operandLeft_} ${operator_} ${operandRight_} = ${operate(operandLeft_,operandRight_,operator_)}`);
                        operandLeft_ = operate(operandLeft_,operandRight_,operator_);
                        operator_ = e.key;
                        operandRight_ = NaN;
                    }
                } 
                else { // If display is currently operator, switch to new operator clicked
                    // EDGE CASE FOR KEY - * should be translated to 'x'
                    if (e.key == "*") {
                        operator_ = 'x'; // set operator_ global variable for evaluation
                        clearDisplay();
                        populateDisplay('x');
                    }
                    else {
                        operator_ = e.key; // set operator_ global variable for evaluation
                        clearDisplay();
                        populateDisplay(e.key);
                    }
                }
            }
        }
    }
    // CONFIGURATION KEY FUNCTIONALITY
    if (e.key == "c" || e.code == "Space" || e.key == "%") {
        e.preventDefault();
        if (display.textContent.length > 0) { 
            if (e.key == "c") {
                resetCalc();
            }
            else if (e.code == "Space") {
                const ret = plusminus(displayToFloat(display.textContent));
                populateDisplay(ret);
            }
            else if (e.key == "%") {
                const ret = percentage(displayToFloat(display.textContent));
                populateDisplay(ret);
            }
        }
    }
    
    // DELETE KEY
    if (e.code == "Backspace") {
        e.preventDefault();
        if (display.textContent.replace(/\s+/g, '').length > 0) {
            display.textContent = display.textContent.replace(/\s+/g, '').slice(0,-1);
        }
    }

});


