const calculatorElement = document.querySelector('.calculator');
const allowedCharacters = {
    0 : 1,
    1 : 1,
    2 : 1,
    3 : 1,
    4 : 1,
    5 : 1,
    6 : 1,
    7 : 1,
    8 : 1,
    9 : 1,
    '-' : 1,
    '+' : 1,
    '=' : 1,
    '/' : 1,
    '*' : 1,
    'Backspace' : 1,
}
const operators = {
    '-' : 1,
    '+' : 1,
    '=' : 1,
    '/' : 1,
    '*' : 1,
}
const inputField = document.querySelector('.calculator__input');
const testStr = '4+2*2*2-4/2';
const keydown = new KeyboardEvent ('keydown', {
    bubbles: true,
    cancelable: true,
})

const opVerification = function(op) {
    if (inputField.value.length == 0 && op !== '-') return true;
    if (operators[inputField.value.slice(-1)]) {
        if (inputField.value.length == 1) {
            inputField.value = '';
            return true; 
        }
        inputField.value = inputField.value.slice(0, -1) + op ;
        return true;
    }
    return false;
}

const calculateExpression = function parseAndCalculateStr(a, op, b) {
    switch (op) {
        case '+':
            return +a + +b;
        case '-':
            return +a - +b;
        case '/':
            return +a / +b;
        case '*':
            return +a * +b;
    }
}

const calculateStr = function(str, regExp) {
    let matched = false;
    do {
        matched = false;
        str = str.replace(regExp,(match, p1, p2, p3) => {
            matched = true;
            return calculateExpression(p1,p2,p3);
         }   
        )
    } while (matched);
    return str;
}

const clear = function() {
    inputField.value = '';
}
// console.log(calculateStr(calculateStr(testStr, /(\d+)([\*\/])(\d+)/), /(\d+)([\-\+])(\d+)/));

document.addEventListener('keydown', (e) => {
    let key  = e.key;
    if (!e.isTrusted) key = e.target.name;
    if (!allowedCharacters[key]) {
        e.preventDefault();
        return;
    }
    if (operators[key] && opVerification(key)) {
        e.preventDefault();
        return;
    }
    if (key === 'Backspace'){
        inputField.value = inputField.value.slice(0, -1);
        return;
    }
    inputField.value += key;
    e.preventDefault();
})


document.addEventListener('click', (e) => {
    if (!e.target.name) return;
    e.target.dispatchEvent(keydown);
})
