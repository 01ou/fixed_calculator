const resultInput = document.getElementById('result');
const processDisplay = document.getElementById('process');
const shiftButton = document.getElementById('shift');

const validOperators = ['+', '-', '*', '/', '%', '**'];

let currentResult = null;
let currentInput = '';
let currentOperator = '+';
let digitNumber = 1;

let history = [];
let isRightAfterInput = false;
let isShift = false;

// 現在の計算結果を設定する関数
const setCurrentResult = (newResult) => {
    const numResult = Number(newResult);
    currentResult = numResult;
    resultInput.value = numResult;
}

// 現在の入力を設定する関数
const setCurrentInput = (newInput) => {
    currentInput = String(newInput);
}

// 演算子を設定する関数
const setOperator = (newOperator) => {
    if (validOperators.includes(newOperator)) {
        currentOperator = newOperator;
        setProcessDisplay(currentInput, newOperator);
    }
}

// 桁数を設定する関数
const setDigitNumber = (newDigit) => {
    digitNumber = Number(newDigit);
}

// プロセス表示を更新する関数
const setProcessDisplay = (value, operator = currentOperator) => {
    if (validOperators.includes(operator)) {
        const process = `${operator}${value}`;
        processDisplay.textContent = process;
    }
}

// Shift状態を設定する関数
const setIsShift = (state) => {
    isShift = state;
    if (!state) {
        calculation(currentInput);
        setCurrentInput('');
    }
    shiftButton.classList.toggle('on-shift', state);
}

// Shift状態を切り替える関数
const toggleShift = () => {
    setIsShift(!isShift);
}

// 履歴を追加する関数
const addToHistory = (processValue, operator, result) => {
    history.push({ processValue, operator, result });
}

// 値を更新する関数
const updateValues = (result, processValue, operator = currentOperator, recordInHistory = true) => {
    setCurrentResult(result);
    setProcessDisplay(processValue, operator);

    if (recordInHistory) {
        addToHistory(processValue, operator, result);
    }
}

// 値をクリアする関数
const clearValues = () => {
    currentResult = null;
    currentInput = '';
    history = [];
    isRightAfterInput = false;
    processDisplay.textContent = '#';
    resultInput.value = 0;
}

// 数値の入力を処理する関数
const handleInputValue = (value) => {
    addDigitToInput(value);
    isRightAfterInput = true;
}

// 現在の入力に数字を追加する関数
const addDigitToInput = (value) => {
    const strValue = String(value);
    const newInput = currentInput + strValue;
    setCurrentInput(newInput);
    setProcessDisplay(currentInput);
    
    if (newInput.length >= digitNumber && !isShift) {
        calculation(newInput);
        setCurrentInput('');
    }
}

// 計算を実行する関数
const calculation = (value) => {
    setupCurrentResult();

    let currentValue = currentResult;
    const num = Number(value);
    
    switch (currentOperator) {
        case '+':
            currentValue += num;
            break;
        case '-':
            currentValue -= num;
            break;
        case '*':
            currentValue *= num;
            break;
        case '/':
            if (num !== 0) {
                currentValue /= num;
            } else {
                console.error('Division by zero error');
            }
            break;
        case '%':
            if (num !== 0) {
                currentValue %= num;
            } else {
                console.error('Modulo by zero error');
            }
            break;
        case '**':
            currentValue **= num;
            break;
        default:
            break;
    }
    
    setCurrentResult(currentValue);
    updateValues(currentValue, num);
}

// 直前の操作を取り消す関数
const undoLastAction = () => {
    console.log(history);
    if (isRightAfterInput) {
        history.pop();
        isRightAfterInput = false;
    }
    
    const previousHistory = history.pop();
    
    if (previousHistory) {
        const { processValue, operator, result } = previousHistory;
        setCurrentInput('');
        updateValues(result, processValue, operator, false);
    } else {
        clearValues();
    }
}

// 結果を変更する関数
const changeResult = (newResult) => {
    const difference =  newResult - currentResult;
    setCurrentResult(newResult);
    const operator = difference < 0 ? '-' : '+';
    updateValues(newResult, Math.abs(difference), operator);
    isRightAfterInput = true;
}

// 初期化関数
const setupCurrentResult = () => {
    if (currentResult === null) {
        currentResult = currentOperator === '+' || currentOperator === '-' ? 0 : 1;
    }
}

// キーボードイベントのハンドラー
document.addEventListener('keydown', event => {
    if (event.key === 'Shift') {
        setIsShift(true);
    }
});

document.addEventListener('keyup', event => {
    if (event.key === 'Shift') {
        setIsShift(false);
    }
});

// HTML要素とのインタラクションのための関数
const inputValue = (value) => {
    handleInputValue(value);
}

const setOperatorFromUI = (value) => {
    setOperator(value);
}

const setDigitNumberFromUI = (value) => {
    setDigitNumber(value);
}

const clearValuesFromUI = () => {
    clearValues();
}

const toggleShiftFormUI = () => {
    toggleShift();
}

const undoLastActionFromUI = () => {
    undoLastAction();
}

const changeResultFromUI = (value) => {
    const numValue = Number(value);
    changeResult(numValue);
}

// クリックに反応するための関数
const clicked = (element) => {
    element.classList.toggle('on-click');
    // 0.5秒後に 'on-click' クラスを削除する
    setTimeout(() => {
        element.classList.remove('on-click');
    }, 125);
}