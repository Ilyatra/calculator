// const calculatorElement = document.querySelector('.calculator');
const numbersKey = {
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
}
const operatorsKey = {
    '-' : 1,
    '+' : 1,
    '/' : 1,
    '*' : 1,
}
const controlKey = {
    'Backspace' : () => inputField.value = inputField.value.slice(0, -1),
    'Clear' : () => inputField.value = '',
    '=' : () => {
        let mulDivRegexp = /((?:(?<=[\-\+\*\/]|^)\-)*\d+\.?\d*)([\*\/])((?:(?<=[\-\+\*\/])\-)*\d+\.?\d*)/;
        let addSubRegexp = /((?:(?<=[\-\+\*\/]|^)\-)*\d+\.?\d*)([\-\+])((?:(?<=[\-\+\*\/])\-)*\d+\.?\d*)/;
        inputField.value = calculateStr(calculateStr(inputField.value, mulDivRegexp), addSubRegexp);
    },
}
const inputField = document.querySelector('.calculator__input');
const resultField = document.querySelector('.calculator__result-field');
const keydownEvent = new KeyboardEvent ('keydown', {
    bubbles: true,
    cancelable: true,
})

const opVerification = function(op) {
    if (inputField.value.length == 0 && op !== '-') return true;
    if (operatorsKey[inputField.value.slice(-1)]) {
        if (inputField.value.length == 1) {
            inputField.value = '';
            return true; 
        }
        inputField.value = inputField.value.slice(0, -1) + op ;
        return true;
    }
    return false;
}

const calculateExpression = function (a, op, b) {
    console.log(a + ' ' + op + ' ' + b)
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
            console.log(match)
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
    if (!numbersKey[key] && !operatorsKey[key] && !controlKey[key]) {
        e.preventDefault();
        return;
    }
    if (operatorsKey[key]) {
        console.log(key)
        if (!opVerification(key)) inputField.value += key
        e.preventDefault();
        return;
    }
    if (controlKey[key]) {
        controlKey[key]();
        e.preventDefault();
        return;
    }
    inputField.value += key;
    e.preventDefault();
})


document.addEventListener('click', (e) => {
    if (!e.target.name) return;
    e.target.dispatchEvent(keydownEvent);
})
