// Operation Functions  - Accounted for float rounding error using toPrecision(15)
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
var operandLeft_ = 0;
var operandRight_ = NaN;
var operator_ = "";
var operatorPressed = false;

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
    const digits = (Math.abs(n)).toString().split('');
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
    operandLeft_ = 0;
    operandRight_ = NaN;
    operator_ = "";
    operatorPressed = false;
    operators.forEach(operator => {
        operator.classList.remove('selected');
    })
}

// Event listeners for each number
const numbers = document.querySelectorAll('.console.number');
const operators = document.querySelectorAll('.console.operator');
const configs = document.querySelectorAll('.console.config');


numbers.forEach(function(number) {
    number.addEventListener('click', e => {
        // reset calculator if number immediately after operation =
        if (operator_ == "=") {
            resetCalc();
        }
        // Clear display, and remove operator button highlight if operator previously pressed 
        if (operatorPressed) {
            clearDisplay();
            operators.forEach(operator => {
                operator.classList.remove('selected');
            })
        }


        operatorPressed = false;
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
            if (operator_ != "" && operator_ != "=" && !operatorPressed) {
                operandRight_ = displayToFloat();
                clearDisplay();
                console.log(`${operandLeft_} ${operator_} ${operandRight_} = ${operate(operandLeft_,operandRight_,operator_)}`);
                populateDisplay(operate(operandLeft_,operandRight_,operator_));
                operator_ = "=";

                // Remove existing operator background color class
                // Loop through to find the operator node with current operator_ 
                operators.forEach(operator => {
                    operator.classList.remove('selected');
                })
            }
        }
        else {
            // Remove existing operator background color class
            // Loop through to find the operator node with current operator_ 
            operators.forEach(operator => {
                operator.classList.remove('selected');
            })
            // Change background color of new selected operator 
            operator.classList.add('selected');

            if (operator_ == "=" || operator_ == "") {
                // EDGECASE - IF '-' PRESSED AT RESET STATE, THEN ALLOW NEGATIVE INPUT 
                if (operator_ == "" && operandLeft_ == 0 && display.textContent.replace(/\s+/g, '').length == 0) {
                    operator_ = operator.textContent; // set operator_ global variable for evaluation
                    operatorPressed = true;
                    // clearDisplay();
                    // populateDisplay(operator.textContent);
                    operandRight_ = NaN;
                }
                else {
                    operator_ = operator.textContent; // set operator_ global variable for evaluation
                    operandLeft_ = displayToFloat(); // set current to left operand global var
                    operatorPressed = true;
                    // clearDisplay();
                    // populateDisplay(operator.textContent);
                    operandRight_ = NaN;
                }
            }
            // Edgecase - chain operations without pressing '=' 
            // ***** WORKING, but does not display chained answers, only store back end until "="
            // ********* TODO-don't display operators, but change background color of button to show active state
            else {
                // Don't run equation if display is currently at operator, so that operand can switch 
                if (!operatorPressed) {
                    operandRight_ = displayToFloat();
                    clearDisplay();
                    populateDisplay(operate(operandLeft_,operandRight_,operator_));
                    console.log(`${operandLeft_} ${operator_} ${operandRight_} = ${operate(operandLeft_,operandRight_,operator_)}`);
                    operandLeft_ = operate(operandLeft_,operandRight_,operator_);
                    operator_ = operator.textContent;
                    operatorPressed = true;
                    operandRight_ = NaN;
                } 
                else { // If display is currently operator, switch to new operator clicked
                    operator_ = operator.textContent; // set operator_ global variable for evaluation
                    console.log('switched to : ', operator_)
                    // clearDisplay();
                    // populateDisplay(operator.textContent);
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
    // NUMBER - KEY SUPPORT
    console.log(e.key);
    if (parseInt(e.key) || e.key == "0" || e.key == ".") {
        e.preventDefault();
        // reset calculator if number immediately after operation =
        if (operator_ == "=") {
            resetCalc();
        }
        // Clear if display is currently operator
        if (operatorPressed) {
            clearDisplay();
            operators.forEach(operator => {
                operator.classList.remove('selected');
            })
        }

        operatorPressed = false;
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
    
    // OPERATOR KEYS SUPPORT
    if (e.key == "/" || e.key == "+" || e.key == "-" || e.key == "*" || e.key == "Enter") {
        e.preventDefault();
        if (e.key == 'Enter') {
            if (operator_ != "" && operator_ != "=" && !operatorPressed) {
                operandRight_ = displayToFloat();
                clearDisplay();
                console.log(`${operandLeft_} ${operator_} ${operandRight_} = ${operate(operandLeft_,operandRight_,operator_)}`);
                populateDisplay(operate(operandLeft_,operandRight_,operator_));
                operator_ = "=";

                // Remove existing operator background color class
                // Loop through to find the operator node with current operator_ 
                operators.forEach(operator => {
                    operator.classList.remove('selected');
                })
            }
        }
        else {
            // Remove existing operator background color class
            // Loop through to find the operator node with current operator_ 
            operators.forEach(operator => {
                operator.classList.remove('selected');
            })
            // Change background color of new selected operator - Loop through and find appropriate node based on key
            operators.forEach(operator => {
                if (e.key == '*') {
                    // EDGE CASE FOR KEY - * should be translated to 'x'
                    if (operator.textContent == 'x') {
                        operator.classList.add('selected');
                    }
                }
                else {
                    if (operator.textContent == e.key) {
                        operator.classList.add('selected');
                    }
                }
            })

            // Non chaining operators
            if (operator_ == "=" || operator_ == "") {
                // EDGECASE - IF '-' PRESSED AT RESET STATE, THEN ALLOW NEGATIVE INPUT 
                if (operator_ == "" && operandLeft_ == 0 && display.textContent.replace(/\s+/g, '').length == 0) {
                    if (e.key == '*') {
                        operator_ = 'x'; // set operator_ global variable for evaluation
                        clearDisplay();
                        operandRight_ = NaN;
                    }
                    else {
                        operator_ = e.key; // set operator_ global variable for evaluation
                        clearDisplay();
                        operandRight_ = NaN;
                    }
                }
                else {
                    if (e.key == '*') {
                        operator_ = 'x'; // set operator_ global variable for evaluation
                        operandLeft_ = displayToFloat(); // set current to left operand global var
                        operatorPressed = true;
                        operandRight_ = NaN;
                    }
                    else {
                        operator_ = e.key; // set operator_ global variable for evaluation
                        operandLeft_ = displayToFloat(); // set current to left operand global var
                        operatorPressed = true;
                        operandRight_ = NaN;
                    }
                    
                }
            }
            // Edgecase - chain operations without pressing '=' 
            // ***** WORKING, but does not display chained answers, only store back end until "="
            // ********* TODO-don't display operators, but change background color of button to show active state
            else {
                // Don't run equation if display is currently at operator, so that operand can switch 
                if (!operatorPressed) {
                    if (e.key == '*') {
                        operandRight_ = displayToFloat();
                        clearDisplay();
                        populateDisplay(operate(operandLeft_,operandRight_,operator_));
                        console.log(`${operandLeft_} ${operator_} ${operandRight_} = ${operate(operandLeft_,operandRight_,operator_)}`);
                        operandLeft_ = operate(operandLeft_,operandRight_,operator_);
                        operator_ = 'x';
                        operatorPressed = true;
                        operandRight_ = NaN;
                    }
                    else {
                        operandRight_ = displayToFloat();
                        clearDisplay();
                        populateDisplay(operate(operandLeft_,operandRight_,operator_));
                        console.log(`${operandLeft_} ${operator_} ${operandRight_} = ${operate(operandLeft_,operandRight_,operator_)}`);
                        operandLeft_ = operate(operandLeft_,operandRight_,operator_);
                        operator_ = e.key;
                        operatorPressed = true;
                        operandRight_ = NaN;
                    }
                } 
                else { // If display is currently operator, switch to new operator clicked
                    if (e.key == '*') {
                        operator_ = 'x';
                    }
                    else {
                        operator_ = e.key; // set operator_ global variable for evaluation
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


