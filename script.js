const display = document.getElementById('display');
let currentInput = '';
let operator = null;
let firstOperand = null;
let shouldResetDisplay = false;

function appendNumber(number) {
    if (shouldResetDisplay) {
        display.value = '';
        shouldResetDisplay = false;
    }
    // Prevent multiple decimal points
    if (number === '.' && display.value.includes('.')) return;
    display.value += number;
    currentInput = display.value;
}

function appendOperator(op) {
    if (currentInput === '' && firstOperand === null) return; // Nothing to operate on

    if (firstOperand !== null && operator && !shouldResetDisplay) {
        // Chain operations: calculate the previous result before applying the new operator
        calculate();
    }

    // If only a number is entered, set it as the first operand
    if (firstOperand === null) {
        firstOperand = parseFloat(currentInput);
    }

    operator = op;
    shouldResetDisplay = true; // Ready for the next number
    currentInput = ''; // Reset current input after operator

    // Optionally display the operator or keep the display showing the first operand
    // display.value = firstOperand + ' ' + operator; // Example: show "5 +"
}

function calculate() {
    if (operator === null || firstOperand === null || shouldResetDisplay) {
        // Added shouldResetDisplay check to prevent calculation right after an operator
        return;
    }

    const secondOperand = parseFloat(currentInput);
    if (isNaN(secondOperand)) return; // Handle cases where second operand isn't valid

    let result;
    switch (operator) {
        case '+':
            result = firstOperand + secondOperand;
            break;
        case '-':
            result = firstOperand - secondOperand;
            break;
        case '*':
            result = firstOperand * secondOperand;
            break;
        case '/':
            if (secondOperand === 0) {
                display.value = 'Error';
                // Reset state after error
                currentInput = '';
                operator = null;
                firstOperand = null;
                shouldResetDisplay = true;
                return;
            }
            result = firstOperand / secondOperand;
            break;
        default:
            return;
    }

    display.value = result;
    firstOperand = result; // Result becomes the new first operand for chained calculations
    operator = null; // Reset operator after calculation
    shouldResetDisplay = true; // Display should reset on next number input
    currentInput = result.toString(); // Update currentInput with the result
}

function clearDisplay() {
    display.value = '';
    currentInput = '';
    operator = null;
    firstOperand = null;
    shouldResetDisplay = false;
}

// Add keyboard support (optional but good UX)
document.addEventListener('keydown', (event) => {
    const key = event.key;

    if (!isNaN(key) || key === '.') {
        appendNumber(key);
    } else if (['+', '-', '*', '/'].includes(key)) {
        appendOperator(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault(); // Prevent default form submission if inside one
        calculate();
    } else if (key === 'Backspace') {
        // Basic backspace functionality
        if (!shouldResetDisplay) {
            display.value = display.value.slice(0, -1);
            currentInput = display.value;
        }
    } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        clearDisplay();
    }
}); 