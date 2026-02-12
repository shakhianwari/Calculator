let expression = '';
let justCalculated = false;

const expressionEl = document.getElementById('expression');
const resultEl = document.getElementById('result');

function updateDisplay() {
    const displayExpr = expression
        .replace(/\*/g, '\u00d7')
        .replace(/\//g, '\u00f7');
    expressionEl.textContent = displayExpr;
}

function appendNumber(num) {
    if (justCalculated) {
        expression = '';
        justCalculated = false;
    }
    expression += num;
    updateDisplay();
}

function appendOperator(op) {
    if (justCalculated) {
        justCalculated = false;
    }
    if (expression === '' && op !== '-') return;
    const lastChar = expression.slice(-1);
    if (['+', '-', '*', '/', '%'].includes(lastChar)) {
        expression = expression.slice(0, -1);
    }
    expression += op;
    updateDisplay();
}

function appendDot() {
    if (justCalculated) {
        expression = '';
        justCalculated = false;
    }
    const parts = expression.split(/[\+\-\*\/\%]/);
    const current = parts[parts.length - 1];
    if (current.includes('.')) return;
    if (current === '') expression += '0';
    expression += '.';
    updateDisplay();
}

function backspace() {
    expression = expression.slice(0, -1);
    justCalculated = false;
    updateDisplay();
    if (expression === '') {
        resultEl.textContent = '0';
    }
}

function clearAll() {
    expression = '';
    justCalculated = false;
    expressionEl.textContent = '';
    resultEl.textContent = '0';
}

function calculate() {
    if (expression === '') return;
    try {
        const sanitized = expression.replace(/[^0-9+\-*/.%]/g, '');
        let result = Function('"use strict"; return (' + sanitized + ')')();
        if (!isFinite(result)) {
            resultEl.textContent = 'Error';
            expression = '';
            return;
        }
        result = Math.round(result * 1e10) / 1e10;
        resultEl.textContent = result;
        expression = String(result);
        justCalculated = true;
    } catch {
        resultEl.textContent = 'Error';
        expression = '';
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
    else if (e.key === '.') appendDot();
    else if (e.key === '+' || e.key === '-') appendOperator(e.key);
    else if (e.key === '*') appendOperator('*');
    else if (e.key === '/') { e.preventDefault(); appendOperator('/'); }
    else if (e.key === '%') appendOperator('%');
    else if (e.key === 'Enter' || e.key === '=') calculate();
    else if (e.key === 'Backspace') backspace();
    else if (e.key === 'Escape') clearAll();
});
