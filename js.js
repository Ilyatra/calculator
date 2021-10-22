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
    '%' : 1,
}
const controlKey = {
    'Backspace' : () => inputField.value = inputField.value.slice(0, -1),
    'Clear' : () => clear(),
    '.' : () => addDot(),
    '=' : () => {
        if (operatorsKey[inputField.value[inputField.value.length-1]]) return;
        inputField.value = round(calculate(inputField.value));
    },
    'Enter' : () => {
        if (operatorsKey[inputField.value[inputField.value.length-1]]) return;
        inputField.value = round(calculate(inputField.value));
    },
    'v' : (ctrl) => {
        if (!ctrl) return;
        navigator.clipboard.readText().then(text => {
                inputField.value = inputField.value + text;
        })
    },
    'c' : (ctrl) => {
        if (!ctrl) return;
        window.navigator.clipboard.writeText(inputField.value);
    }
}
const inputField = document.querySelector('.calculator__input');
const resultField = document.querySelector('.calculator__result-field');
const keydownEvent = new KeyboardEvent ('keydown', {
    bubbles: true,
    cancelable: true,
})

const inputEvent = new 	InputEvent ('input', {
    bubbles: true,
    cancelable: true,
})

const opProcessing = function(op) {
    if (inputField.value.length == 0 && op !== '-') return;
    if (operatorsKey[inputField.value.slice(-1)]) {
        if (inputField.value.length == 1) {
            inputField.value = '';
            return; 
        }
        inputField.value = inputField.value.slice(0, -1) + op;
        return;
    }
    inputField.value += op;
    return;
}

const calculateExpression = function (a, op, b) {
    console.log(a,op,b)
    switch (op) {
        case '+':
            return +a + +b;
        case '-':
            return +a - +b;
        case '/':
            return +a / +b;
        case '*':
            return +a * +b;
        case '%':
            return +a / 100 * +b;
    }
}

const testString = function(str, searchValueInObj) {
    for (let i = 1; i < str.length; i++) {
        if (searchValueInObj[str[i]]) {
            return [str[i], i];
        }
    }
    return [false, false];
}

const searchExpression = function(str, op, opPos){
    const needle = Object.assign(numbersKey, {'.' : 1, '-' : 1});
    let leftSide = '', rightSide = '';
    let startPos, endPos;
    for(let i = opPos - 1; i >= 0; i--) {
        if (!needle[str[i]]) break;
        leftSide = leftSide + str[i];
        startPos = i;
        if (str[i] === '-') break;
    }
    leftSide = leftSide.split('').reverse().join('');
    for(let i = opPos + 1; i < str.length; i++) {
        if (!needle[str[i]]) break;
        if (str[i] === '-') break;
        rightSide = rightSide + str[i];
        endPos = i;
    }
    return {leftSide, rightSide, startPos, endPos}
}

const calculate = function(str) {
    let op;
    let opPos;
    const firstPriorityOp = {'*':1,'%':1,'/':1,};
    const secondPriorityOp = {'-':1,'+':1,};

    const f = function(priority){
        op = '';
        [op, opPos] = testString(str, priority);
        if (!op) return;
        let {leftSide, rightSide, startPos, endPos} = searchExpression(str, op, opPos);
        if (rightSide === '' || leftSide ===  '') {
            op = false;
            return;
        }
        let result = calculateExpression(leftSide, op, rightSide);
        str = str.slice(0, startPos) + result + str.slice(endPos + 1);
    }
    do {
        f (firstPriorityOp);
    } while (op)
    do {
        f (secondPriorityOp);
    } while (op)
    return str;
}

const round = function(num) {
    return Math.round(num * 1e8) / 1e8;
  }

const addDot = function() {
    for (let i = inputField.value.length - 1; i > 0; i--) {
        let sym = inputField.value[i];
        if (sym === '.') return;
        if (operatorsKey[sym]) {
            inputField.value = inputField.value + '.';
            return;
        }
    }
    inputField.value = inputField.value + '.';
}

const clear = function() {
    inputField.value = '';
}

document.addEventListener('keydown', (e) => {
    let key  = e.key;
    if (!e.isTrusted) key = e.target.name;
    if (!numbersKey[key] && !operatorsKey[key] && !controlKey[key]) {
        e.preventDefault();
        return;
    }

    inputField.focus();
    inputField.setSelectionRange(inputField.value.length-1, inputField.value.length-1);

    if (inputField.value.length < 12 && inputField.classList.contains('smaller-font')){
        inputField.classList.remove('smaller-font');
        inputField.classList.remove('more-smaller-font');
    }else if (inputField.value.length > 12 && !inputField.classList.contains('smaller-font')){
        inputField.classList.add('smaller-font');
    }
    if (operatorsKey[key]) {
        opProcessing(key);
        e.preventDefault();
        return;
    }
    if (controlKey[key]) {
        controlKey[key](e.ctrlKey);
        // e.preventDefault();
        return;
    }
    inputField.value += key;
    e.preventDefault();
})


document.addEventListener('click', (e) => {
    if (!e.target.name) return;
    e.target.dispatchEvent(keydownEvent);
})
