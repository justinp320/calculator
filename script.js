let firstOperand = '';
let secondOperand = '';
let currentOperator = null;
let isExponential = false;
let expValue = 0;

const displayNumbers = document.getElementById('answer');
const displayMath = document.getElementById('math');
const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const clearButton = document.querySelector('[data-clear]');
const backButton = document.querySelector('[data-backspace]');
const signButton = document.querySelector('[data-sign]');
const equalsButton = document.querySelector('[data-equals]');

clearButton.addEventListener('click', clear);
backButton.addEventListener('click', deleteNumber);
signButton.addEventListener('click', changeSign);
equalsButton.addEventListener('click', equals);

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        appendNumber(button.textContent);
    });
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        setOperator(button.textContent);
    });
});

function appendNumber(number){
    if (number=='.' && displayNumbers.textContent.includes('.')){
        displayNumbers.textContent = displayNumbers.textContent;
    }
    else if (number=='.' && displayNumbers.textContent == '0'){
        displayNumbers.textContent = '0.';
    }
    else if (displayNumbers.textContent == '0'){
        displayNumbers.textContent = number;
    }
    else if (displayNumbers.textContent == '-0'){
        displayNumbers.textContent = `-${number}`;
    }
    else if ((displayNumbers.textContent.length >= 10)){
        isExponential = true;
        expValue = Number(displayNumbers.textContent += number) 
        displayNumbers.textContent = expValue.toExponential(2);
    }
    else if (isExponential){
        expValue = Number(expValue.toString() + number);
        displayNumbers.textContent = expValue.toExponential(2);
    }
    else{
        displayNumbers.textContent += number;
    }
}

function setOperator(operator){
    isExponential = false;
    expValue = 0;
    if (currentOperator != null){
        currentOperator = operator;
        displayMath.textContent = `${firstOperand} ${currentOperator} `;
    }
    else{

    firstOperand = displayNumbers.textContent;
    displayNumbers.textContent = '';
    currentOperator = operator;
    displayMath.textContent = `${firstOperand} ${currentOperator} `;
    }
}

function changeSign(){
    if (displayNumbers.textContent == '-0'){
        displayNumbers.textContent = 0;
    }
    else if (displayNumbers.textContent == 0){
        displayNumbers.textContent = '-0';
    }
    else if (isExponential){
        expValue*=(-1);
        displayNumbers.textContent = expValue.toExponential(2);
    }
    else{
    displayNumbers.textContent = Number(displayNumbers.textContent)*(-1);
    }
}

function clear(){
    displayNumbers.textContent = '0';
    displayMath.textContent = '';
    firstOperand = '';
    secondOperand = '';
    currentOperator = null;
    isExponential = false;
    expValue = 0;
}

function deleteNumber(){
    let num = displayNumbers.textContent.toString();
    if ( currentOperator!= null && num.length <= 1){
        displayNumbers.textContent = '';
    }
    else if ((num.length == 1) || (num.length==2 && num.includes('-'))){
        clear();
    }
    else if (isExponential){
        let checkExp = expValue.toString().slice(0, -1);
        if (checkExp.length <= 10){
            displayNumbers.textContent = checkExp;
            isExponential = false;
            expValue = 0;
        }
        else{
            expValue = Number(checkExp);
            displayNumbers.textContent = Number(checkExp).toExponential(2);
        }
    }
    else{
        displayNumbers.textContent = num.slice(0, -1);
    }
}

function equals(){
    if (currentOperator=='÷' && (Number(displayNumbers.textContent)==0 || firstOperand == 0)){
        alert("You cannot divide by zero");
        return;
    }
    if (currentOperator!=null){
        secondOperand = displayNumbers.textContent;
        displayMath.textContent+= ` ${secondOperand} =`;
        let ans = Math.round ((operate(Number(firstOperand), Number(secondOperand), currentOperator)) * 1000) / 1000;
        if (ans.toString().length >= 10){
            expValue = Number(ans);
            isExponential = true;
            displayNumbers.textContent = ans.toExponential(2);
            currentOperator = null;
        }
        else{
            displayNumbers.textContent = ans;
            currentOperator = null;
        }
    }
}

function add(a, b){
    return a + b;
}

function subtract(a, b){
    return a - b;
}

function multiply(a, b){
    return a * b;
}

function divide(a, b){
    return a / b;
}

function operate(a, b, operator){
    a = Number(a);
    b = Number(b);
    switch(operator){
        case '+':
            return add(a, b);
        case '-':
            return subtract(a, b);
        case '×':
            return multiply(a, b);
        case '÷':
            return divide(a, b);
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key=='Backspace'){
        deleteNumber();
    }
    else if (e.key=='Enter' || e.key=='='){
        equals();
    }
    else if (e.key=='+'){
        setOperator(e.key);
    }
    else if (e.key=='-'){
        setOperator(e.key);
    }
    else if (e.key=='*'){
        setOperator('×');
    }
    else if (e.key=='/'){
        setOperator('÷');
    }
    else if ((e.key <= 9 && e.key >= 0) || e.key=='.'){
        appendNumber(e.key);
    }
});
