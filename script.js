const state = {
    score: 0, // Reset to 0 on every refresh
    currentMode: 'multiplication',
    timer: 30,
    interval: null,
    correctAns: 0
};

const elements = {
    question: document.getElementById("question"),
    input: document.getElementById("input"),
    form: document.getElementById("form"),
    score: document.getElementById("score"),
    timerText: document.getElementById("timerText"),
    timerBar: document.getElementById("timerBar"),
    timerContainer: document.getElementById("timerContainer"),
    feedback: document.getElementById("feedback"),
    modeBtns: document.querySelectorAll(".mode-btn")
};

const operators = {
    addition: { symbol: '+', calc: (a, b) => a + b },
    subtraction: { symbol: '-', calc: (a, b) => a - b },
    multiplication: { symbol: '×', calc: (a, b) => a * b },
    division: { symbol: '÷', calc: (a, b) => a / b }
};

function generateQuestion() {
    let type = state.currentMode;
    
    // Quiz Mode Logic
    if (type === 'random') {
        const keys = Object.keys(operators);
        type = keys[Math.floor(Math.random() * keys.length)];
    }

    let n1 = Math.ceil(Math.random() * 12);
    let n2 = Math.ceil(Math.random() * 12);

    // Ensure clean division and no negative subtraction
    if (type === 'division') n1 = n1 * n2;
    if (type === 'subtraction' && n1 < n2) [n1, n2] = [n2, n1];

    state.correctAns = operators[type].calc(n1, n2);
    elements.question.innerText = `What is ${n1} ${operators[type].symbol} ${n2}?`;
    
    // Timer visibility logic
    if (state.currentMode === 'random') {
        elements.timerContainer.style.display = 'block';
        resetTimer();
    } else {
        clearInterval(state.interval);
        elements.timerContainer.style.display = 'none';
        elements.timerText.innerText = "Mode: Practice";
    }
}

function resetTimer() {
    clearInterval(state.interval);
    state.timer = 30;
    updateTimerUI();
    state.interval = setInterval(() => {
        state.timer--;
        updateTimerUI();
        if (state.timer <= 0) handleResult(false, true);
    }, 1000);
}

function updateTimerUI() {
    elements.timerText.innerText = `Time: ${state.timer}s`;
    elements.timerBar.style.width = `${(state.timer / 30) * 100}%`;
    elements.timerBar.style.backgroundColor = state.timer <= 10 ? "var(--danger)" : "var(--accent)";
}

function handleResult(isCorrect, isTimeout = false) {
    if (isCorrect) {
        state.score++;
        showFeedback("Correct!", "var(--success)");
    } else {
        state.score--;
        const msg = isTimeout ? `Time's Up! Ans: ${state.correctAns}` : `Wrong! Correct: ${state.correctAns}`;
        showFeedback(msg, "var(--danger)");
    }
    
    updateScoreDisplay();
    elements.input.value = "";
    generateQuestion();
}

function showFeedback(text, color) {
    elements.feedback.innerText = text;
    elements.feedback.style.color = color;
    elements.feedback.style.opacity = "1";
    elements.input.style.borderColor = color;
    
    // Feedback persists for 2 seconds
    setTimeout(() => {
        elements.feedback.style.opacity = "0";
        elements.input.style.borderColor = "#333";
    }, 2000);
}

function updateScoreDisplay() {
    elements.score.innerText = `Score: ${state.score}`;
}

// Mode Event Listeners
elements.modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        elements.modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.currentMode = btn.dataset.type;
        generateQuestion();
    });
});

// Form Submission
elements.form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (elements.input.value === "") return;
    
    const userAns = parseFloat(elements.input.value);
    handleResult(userAns === state.correctAns);
});

// Initialize on Load
updateScoreDisplay();
generateQuestion();