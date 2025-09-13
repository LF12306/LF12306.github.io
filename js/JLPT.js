// 检查单选题答案
function checkChoiceAnswer(question) {
    const selectedOption = question.querySelector('input[type="radio"]:checked');
    const correctAnswer = question.getAttribute('data-answer');
    const explanation = question.getAttribute('data-explanation');
    const feedback = question.querySelector('.feedback');

    if (!selectedOption) {
        feedback.innerHTML = '';
        return false;
    }

    const userAnswer = selectedOption.value;

    if (userAnswer === correctAnswer) {
        feedback.innerHTML = '✓ 回答正确！' + (explanation ? `<br><strong>解析：</strong>${explanation}` : '');
        feedback.className = 'feedback correct';
        return true;
    } else {
        feedback.innerHTML = `✗ 回答错误！正确答案是：${correctAnswer}` + (explanation ? `<br><strong>解析：</strong>${explanation}` : '');
        feedback.className = 'feedback incorrect';
        return false;
    }
}


// 检查填空题答案
function checkFillAnswer(question) {
    const inputs = question.querySelectorAll('.blank-input');
    const answers = JSON.parse(question.getAttribute('data-answer'));
    const feedback = question.querySelector('.feedback');
    const explanation = question.getAttribute('data-explanation');
    let allCorrect = true;
    let allFilled = true;
    
    for (let i = 0; i < inputs.length; i++) {
        const userAnswer = inputs[i].value.trim().toLowerCase();
        const correctAnswer = answers[i].toLowerCase();
        
        if (userAnswer === '') {
            allFilled = false;
        } else if (userAnswer !== correctAnswer) {
            allCorrect = false;
        }
    }
    
    if (!allFilled) {
        feedback.innerHTML = '';
        return false;
    }
    
    if (allCorrect) {
        feedback.innerHTML = '✓ 回答正确！' + (explanation ? `<br><strong>解析：</strong>${explanation}` : '');
        feedback.className = 'feedback correct';
        return true;
    } else {
        feedback.innerHTML = `✗ 回答错误！正确答案是：${answers.join('、')}` + (explanation ? `<br><strong>解析：</strong>${explanation}` : '');
        feedback.className = 'feedback incorrect';
        return false;
    }
}

// 检查多选题答案
function checkMultiAnswer(question) {
    const selectedOptions = question.querySelectorAll('input[type="checkbox"]:checked');
    const correctAnswers = JSON.parse(question.getAttribute('data-answer'));
    const feedback = question.querySelector('.feedback');
    const explanation = question.getAttribute('data-explanation');

    if (selectedOptions.length === 0) {
        feedback.innerHTML = '';
        return false;
    }

    const userAnswers = Array.from(selectedOptions).map(opt => opt.value);

    // 转成Set进行集合判断
    const userSet = new Set(userAnswers);
    const correctSet = new Set(correctAnswers);

    // 长度不同，必错
    if (userSet.size !== correctSet.size) {
        feedback.innerHTML = `✗ 回答错误！正确答案是：${correctAnswers.join('、')}` + (explanation ? `<br><strong>解析：</strong>${explanation}` : '');
        feedback.className = 'feedback incorrect';
        return false;
    }

    // 判断集合是否相同
    let allMatch = true;
    correctSet.forEach(item => {
        if (!userSet.has(item)) {
            allMatch = false;
        }
    });

    if (allMatch) {
        feedback.innerHTML = '✓ 回答正确！' + (explanation ? `<br><strong>解析：</strong>${explanation}` : '');
        feedback.className = 'feedback correct';
        return true;
    } else {
        feedback.innerHTML = `✗ 回答错误！正确答案是：${correctAnswers.join('、')}` + (explanation ? `<br><strong>解析：</strong>${explanation}` : '');
        feedback.className = 'feedback incorrect';
        return false;
    }
}


// 检查判断题答案
function checkJudgeAnswer(question) {
    const selectedOption = question.querySelector('input[type="radio"]:checked');
    const correctAnswer = question.getAttribute('data-answer');
    const feedback = question.querySelector('.feedback');
    const explanation = question.getAttribute('data-explanation');

    if (!selectedOption) {
        feedback.innerHTML = '';
        return false;
    }
    
    const userAnswer = selectedOption.value;
    
    if (userAnswer === correctAnswer) {
        feedback.innerHTML = '✓ 回答正确！' + (explanation ? `<br><strong>解析：</strong>${explanation}` : '');
        feedback.className = 'feedback correct';
        return true;
    } else {
        feedback.innerHTML = `✗ 回答错误！正确答案是：${correctAnswer}` + (explanation ? `<br><strong>解析：</strong>${explanation}` : '');
        feedback.className = 'feedback incorrect';
        return false;
    }
}

// 提交所有答案
function submitAnswers() {
    let correctCount = 0;
    let totalScore = 0;
    const totalQuestions = document.querySelectorAll('.question').length;

    // 单选题
    const choiceQuestions = document.querySelectorAll('.question[data-type="choice"]');
    choiceQuestions.forEach(question => {
        if (checkChoiceAnswer(question)) {
            correctCount++;
            totalScore += 1;
        }
    });

    // 多选题
    const multiQuestions = document.querySelectorAll('.question[data-type="multi"]');
    multiQuestions.forEach(question => {
        if (checkMultiAnswer(question)) {
            correctCount++;
            totalScore += 2;
        }
    });

    // 判断题
    const judgeQuestions = document.querySelectorAll('.question[data-type="judge"]');
    judgeQuestions.forEach(question => {
        if (checkJudgeAnswer(question)) {
            correctCount++;
            totalScore += 1;
        }
    });

    // 填空题
    const fillQuestions = document.querySelectorAll('.question[data-type="fill"]');
    fillQuestions.forEach(question => {
        const isCorrect = checkFillAnswer(question);
        if (isCorrect) {
            correctCount++;
            const scoreElement = question.querySelector('.question-score');
            const score = scoreElement ? parseInt(scoreElement.textContent) : 1;
            totalScore += score;
        }
    });

// 显示结果
const resultsDiv = document.getElementById('results');
const scoreSpan = document.getElementById('score');
const progressBar = document.getElementById('progressBar');
const resultDetails = document.getElementById('resultDetails');

// ⬇⬇ 新增动态计算 maxScore ⬇⬇
let maxScore = 0;
maxScore += choiceQuestions.length * 1;
maxScore += multiQuestions.length * 2;
maxScore += judgeQuestions.length * 1;
fillQuestions.forEach(question => {
    const scoreElement = question.querySelector('.question-score');
    const score = scoreElement ? parseInt(scoreElement.textContent) : 1;
    maxScore += score;
});
// ⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆

scoreSpan.textContent = totalScore;
const correctRate = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
const progressPercentage = Math.min(correctRate, 100);
progressBar.style.width = `${progressPercentage}%`;

resultDetails.textContent = `您答对了 ${correctCount} 题（共 ${totalQuestions} 题），正确率为 ${correctRate.toFixed(2)}%`;


resultsDiv.style.display = 'block';
resultsDiv.scrollIntoView({ behavior: 'smooth' });

}


// 重置所有答案
function resetForm() {
    // 重置单选题
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });
    
    // 重置多选题
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
        
    // 重置填空题
    document.querySelectorAll('.blank-input').forEach(input => {
        input.value = '';
    });

    // 清除反馈信息
    document.querySelectorAll('.feedback').forEach(feedback => {
        feedback.innerHTML = '';
        feedback.className = 'feedback';
    });
    
    // 重置主观题
    document.querySelector('.subjective-answer').value = '';
    
    // 隐藏结果
    document.getElementById('results').style.display = 'none';
}

// 为单选按钮添加事件监听
// 修改后：只为判断题添加实时检查
document.querySelectorAll('.question[data-type="judge"] input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const question = this.closest('.question');
        checkJudgeAnswer(question);
    });
});



// 新增：为单选题的“确定”按钮绑定事件
document.querySelectorAll('.question[data-type="choice"] .check-multi-button').forEach(button => {
    button.addEventListener('click', function () {
        const question = this.closest('.question');
        checkChoiceAnswer(question); // 调用单选题的检查函数
    });
});



// 为填空题添加事件监听
document.querySelectorAll('.blank-input').forEach(input => {
    input.addEventListener('blur', function() {
        const question = this.closest('.question');
        checkFillAnswer(question);
    });
});



// 为每道多选题绑定“确定”按钮
document.querySelectorAll('.question[data-type="multi"] .check-multi-button').forEach(button => {
    button.addEventListener('click', function () {
        const question = this.closest('.question');
        checkMultiAnswer(question);
    });
});

// 主观题参考答案
function toggleSubjectiveAnswer(button) {
    const question = button.closest('.question');
    const textarea = question.querySelector('.subjective-answer');
    const reference = question.querySelector('.reference-answer');

    if (textarea.value.trim() === '') {
        alert('请先完成作答后再查看参考答案');
        return;
    }

    if (reference.style.display === 'none') {
        reference.style.display = 'block';
        button.textContent = '隐藏参考答案';
    } else {
        reference.style.display = 'none';
        button.textContent = '查看参考答案';
    }
}

