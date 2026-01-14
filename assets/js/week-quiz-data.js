// NOAI 第一周测验 - Python编程基础
(function() {
    'use strict';

    // 第一周测验题目数据 - 25题，40分钟
    const WEEK1_QUIZ = [
        // ========== Python基础语法 (6题) ==========
        {
            id: 1,
            type: 'single',
            question: '以下哪个是Python中正确的变量名？',
            options: ['2name', 'my-name', 'my_name', 'class'],
            answer: 2,
            explanation: 'Python变量名规则：可以包含字母、数字和下划线，但不能以数字开头，不能使用关键字。my_name 符合规则；2name以数字开头错误；my-name包含连字符错误；class是关键字错误。'
        },
        {
            id: 2,
            type: 'single',
            question: 'Python中表示"不等于"的运算符是？',
            options: ['!=', '<>', '==', '='],
            answer: 0,
            explanation: 'Python中"不等于"运算符是 != 或 <>（<>在Python3中已废弃）。==是等于，=是赋值。'
        },
        {
            id: 3,
            type: 'judge',
            question: 'Python是一种解释型语言。',
            answer: true,
            explanation: '正确。Python是解释型语言，代码不需要编译，由Python解释器逐行执行。'
        },
        {
            id: 4,
            type: 'single',
            question: 'print(type(3.14))的输出结果是？',
            options: ['&lt;class "int"&gt;', '&lt;class "float"&gt;', '&lt;class "str"&gt;', '&lt;class "number"&gt;'],
            answer: 1,
            explanation: '3.14是浮点数，Python中浮点数的类型是float。type()函数返回变量的类型。'
        },
        {
            id: 5,
            type: 'single',
            question: '以下哪个是Python中的多行注释方式？',
            options: ['// 这是注释', '/* 这是注释 */', '# 这是注释', '""" 这是多行注释 """'],
            answer: 3,
            explanation: 'Python中使用 # 表示单行注释，使用三引号("""或\'\'\')表示多行注释。'
        },
        {
            id: 6,
            type: 'judge',
            question: 'Python对缩进敏感，缩进不一致会导致语法错误。',
            answer: true,
            explanation: '正确。Python使用缩进来表示代码块，缩进必须一致，通常使用4个空格。'
        },

        // ========== 数据类型 (5题) ==========
        {
            id: 7,
            type: 'single',
            question: '以下代码的输出结果是？<br><code>print(len("Python"))</code>',
            options: ['5', '6', '7', '报错'],
            answer: 1,
            explanation: 'len()函数返回字符串的长度。"Python"有6个字符，所以输出是6。'
        },
        {
            id: 8,
            type: 'single',
            question: '将字符串"123"转换为整数的方法是？',
            options: ['Integer("123")', 'int("123")', 'strToInt("123")', 'parse("123")'],
            answer: 1,
            explanation: 'Python中使用int()函数将字符串转换为整数：int("123")得到整数123。'
        },
        {
            id: 9,
            type: 'judge',
            question: '列表是Python中可变的有序序列。',
            answer: true,
            explanation: '正确。列表(list)是可变的、有序的序列，可以随时添加、删除或修改元素。'
        },
        {
            id: 10,
            type: 'single',
            question: '以下哪个是空字典的表示方式？',
            options: ['[]', '{}', '()', 'set()'],
            answer: 1,
            explanation: '[]是空列表，()是空元组，set()是空集合，{}是空字典。'
        },
        {
            id: 11,
            type: 'single',
            question: '表达式 "Hello" + "World" 的结果是？',
            options: ['"HelloWorld"', '"Hello World"', '报错', '"Hello+World"'],
            answer: 0,
            explanation: 'Python中+运算符用于字符串时表示连接，"Hello" + "World" = "HelloWorld"。'
        },

        // ========== 控制结构 (6题) ==========
        {
            id: 12,
            type: 'single',
            question: '以下代码的输出结果是？<br><code>x = 5<br>if x &gt; 3:<br>&nbsp;&nbsp;&nbsp;&nbsp;print("A")<br>else:<br>&nbsp;&nbsp;&nbsp;&nbsp;print("B")</code>',
            options: ['A', 'B', 'AB', '报错'],
            answer: 0,
            explanation: 'x=5，条件 x>3 为真，执行if分支，输出"A"。'
        },
        {
            id: 13,
            type: 'single',
            question: 'for i in range(5): 会循环几次？',
            options: ['4次', '5次', '6次', '无限次'],
            answer: 1,
            explanation: 'range(5)生成序列[0,1,2,3,4]，共5个元素，所以循环5次。'
        },
        {
            id: 14,
            type: 'judge',
            question: 'while循环的次数是确定的。',
            answer: false,
            explanation: '错误。while循环根据条件判断执行次数，条件为真时继续执行，次数不确定。'
        },
        {
            id: 15,
            type: 'single',
            question: '用于跳出循环的关键字是？',
            options: ['continue', 'break', 'return', 'exit'],
            answer: 1,
            explanation: 'break用于跳出循环，continue用于跳过本次循环继续下一次。'
        },
        {
            id: 16,
            type: 'single',
            question: '以下代码的输出结果是？<br><code>for i in range(3):<br>&nbsp;&nbsp;&nbsp;&nbsp;if i == 1:<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;continue<br>&nbsp;&nbsp;&nbsp;&nbsp;print(i)</code>',
            options: ['0 1 2', '0 2', '1 2', '0 1'],
            answer: 1,
            explanation: 'i=0时输出0；i=1时continue跳过；i=2时输出2。输出"0 2"。'
        },
        {
            id: 17,
            type: 'judge',
            question: 'Python中的elif相当于Java中的else if。',
            answer: true,
            explanation: '正确。elif是"else if"的缩写，用于检查多个条件。'
        },

        // ========== 函数 (4题) ==========
        {
            id: 18,
            type: 'single',
            question: '定义函数的关键字是？',
            options: ['function', 'func', 'def', 'define'],
            answer: 2,
            explanation: 'Python使用def关键字定义函数，如：def my_function():'
        },
        {
            id: 19,
            type: 'single',
            question: '以下代码的输出结果是？<br><code>def add(a, b=2):<br>&nbsp;&nbsp;&nbsp;&nbsp;return a + b<br>print(add(3))</code>',
            options: ['3', '5', '报错', '2'],
            answer: 1,
            explanation: '函数add中b有默认值2，调用add(3)时，a=3, b=2，返回5。'
        },
        {
            id: 20,
            type: 'judge',
            question: '函数必须使用return语句返回值。',
            answer: false,
            explanation: '错误。函数可以没有return语句，此时返回None。'
        },
        {
            id: 21,
            type: 'single',
            question: '以下哪个是正确的函数调用？',
            options: ['call my_func()', 'my_func()', 'exec my_func()', 'run my_func()'],
            answer: 1,
            explanation: 'Python中使用函数名加括号调用函数：my_func()。'
        },

        // ========== 列表与字符串操作 (4题) ==========
        {
            id: 22,
            type: 'single',
            question: '获取列表中最后一个元素的方法是？',
            options: ['list.last()', 'list[-1]', 'list[end]', 'list.get(-1)'],
            answer: 1,
            explanation: 'Python中使用负索引从末尾访问元素，-1表示最后一个元素。'
        },
        {
            id: 23,
            type: 'single',
            question: '以下代码的输出结果是？<br><code>nums = [1, 2, 3, 4, 5]<br>print(nums[1:4])</code>',
            options: ['[1, 2, 3]', '[2, 3, 4]', '[2, 3, 4, 5]', '[1, 2, 3, 4]'],
            answer: 1,
            explanation: '切片[1:4]获取索引1到3的元素（不包含结束索引4），结果是[2, 3, 4]。'
        },
        {
            id: 24,
            type: 'judge',
            question: '字符串是不可变的，不能修改其中的字符。',
            answer: true,
            explanation: '正确。Python字符串是不可变类型，不能直接修改，需要创建新字符串。'
        },
        {
            id: 25,
            type: 'single',
            question: '向列表末尾添加元素的方法是？',
            options: ['list.add()', 'list.append()', 'list.push()', 'list.insert()'],
            answer: 1,
            explanation: 'Python列表使用append()方法在末尾添加元素：list.append(item)。'
        }
    ];

    // 状态变量
    let userAnswers = {};
    let timer = null;
    let timeRemaining = 40 * 60; // 40分钟

    // 开始测验
    function startQuiz() {
        document.getElementById('startScreen').style.display = 'none';
        document.getElementById('quizScreen').style.display = 'block';
        renderQuestions();
        startTimer();
    }

    // 计时器
    function startTimer() {
        updateTimerDisplay();
        timer = setInterval(() => {
            timeRemaining--;
            updateTimerDisplay();
            if (timeRemaining <= 0) {
                clearInterval(timer);
                submitQuiz();
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        document.getElementById('timer').textContent =
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        if (timeRemaining < 300) { // 最后5分钟
            document.getElementById('timer').style.color = '#ef4444';
        }
    }

    // 渲染题目列表
    function renderQuestions() {
        const container = document.getElementById('questionList');
        let html = '';

        WEEK1_QUIZ.forEach((q, index) => {
            const optionsHtml = q.type === 'single'
                ? q.options.map((opt, i) => `
                    <div class="option-label" onclick="selectOption(${q.id}, ${i}, this)">
                        <input type="radio" name="q${q.id}" value="${i}" class="me-2">
                        <span>${String.fromCharCode(65 + i)}. ${opt}</span>
                    </div>
                `).join('')
                : `
                    <div class="option-label" onclick="selectOption(${q.id}, true, this)">
                        <input type="radio" name="q${q.id}" value="true" class="me-2">
                        <span>正确</span>
                    </div>
                    <div class="option-label" onclick="selectOption(${q.id}, false, this)">
                        <input type="radio" name="q${q.id}" value="false" class="me-2">
                        <span>错误</span>
                    </div>
                `;

            html += `
                <div class="question-card" id="card-${q.id}">
                    <div class="d-flex justify-content-between mb-2">
                        <span class="badge bg-primary">第 ${index + 1} 题</span>
                        <span class="badge ${q.type === 'single' ? 'bg-info' : 'bg-warning'}">${q.type === 'single' ? '单选题' : '判断题'}</span>
                    </div>
                    <h5 class="mb-3">${q.question}</h5>
                    <div class="options">${optionsHtml}</div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    // 选择答案
    function selectOption(questionId, answer, element) {
        userAnswers[questionId] = answer;

        // 选中radio输入框
        const radio = element.querySelector('input[type="radio"]');
        if (radio) {
            radio.checked = true;
        }

        // 更新UI
        const card = document.getElementById(`card-${questionId}`);
        card.classList.add('answered');

        // 更新选项样式
        const parent = element.parentElement;
        parent.querySelectorAll('.option-label').forEach(opt => {
            opt.classList.remove('selected');
        });
        element.classList.add('selected');

        // 更新进度
        updateProgress();
    }

    // 更新进度
    function updateProgress() {
        const answered = Object.keys(userAnswers).length;
        const total = WEEK1_QUIZ.length;
        const percent = (answered / total) * 100;

        document.getElementById('answeredCount').textContent = answered;
        document.getElementById('progressBar').style.width = percent + '%';
    }

    // 提交答案
    function submitQuiz() {
        try {
            console.log('submitQuiz called, userAnswers:', Object.keys(userAnswers).length, 'questions answered');

            // 检查是否所有题目都已作答
            if (Object.keys(userAnswers).length < WEEK1_QUIZ.length) {
                if (!confirm(`你还有 ${WEEK1_QUIZ.length - Object.keys(userAnswers).length} 题未作答，确定要提交吗？`)) {
                    return;
                }
            }

            if (timer) clearInterval(timer);

            let correct = 0;
            let wrong = [];
            let results = [];

            WEEK1_QUIZ.forEach(q => {
                const userAnswer = userAnswers[q.id];
                const isCorrect = userAnswer === q.answer;

                if (isCorrect) {
                    correct++;
                } else {
                    wrong.push({
                        questionId: q.id,
                        question: q.question,
                        yourAnswer: userAnswer,
                        correctAnswer: q.answer
                    });
                }

                results.push({
                    question: q,
                    userAnswer: userAnswer,
                    isCorrect: isCorrect
                });
            });

            const score = Math.round((correct / WEEK1_QUIZ.length) * 100);

            // 显示结果
            document.getElementById('quizScreen').style.display = 'none';
            document.getElementById('resultScreen').style.display = 'block';
            document.getElementById('finalScore').textContent = score;

            const resultAlert = document.getElementById('resultAlert');
            if (score >= 60) {
                resultAlert.className = 'alert alert-success';
                resultAlert.innerHTML = `
                    <strong>恭喜通过！</strong>
                    <p class="mb-0">你已完成第一周测验，下周内容已解锁！<br>
                    答对：${correct} 题 | 答错：${WEEK1_QUIZ.length - correct} 题</p>
                `;

                // 解锁下周
                if (window.NOAIUnlock) {
                    window.NOAIUnlock.unlockNextWeek();
                }
            } else {
                resultAlert.className = 'alert alert-warning';
                resultAlert.innerHTML = `
                    <strong>继续努力！</strong>
                    <p class="mb-0">需要达到60分才能解锁下周内容。<br>
                    答对：${correct} 题 | 答错：${WEEK1_QUIZ.length - correct} 题</p>
                `;
            }

            // 保存进度（用 try-catch 防止错误影响结果保存）
            try {
                if (window.NOAIProgress) {
                    window.NOAIProgress.recordQuiz('week1', correct, WEEK1_QUIZ.length, wrong, 1);
                }
            } catch (e) {
                console.warn('Failed to save progress:', e);
            }

            // 保存结果供解析使用（必须执行）
            window.quizResults = results;
            console.log('Quiz results saved:', window.quizResults.length, 'questions');

        } catch (e) {
            console.error('Error in submitQuiz:', e);
            alert('提交答案时出错：' + e.message);
        }
    }

    // 显示解析
    function showExplanations() {
        console.log('showExplanations called, window.quizResults:', window.quizResults);
        const section = document.getElementById('explanationsSection');
        const container = document.getElementById('explanationsList');

        if (!section || !container) {
            console.error('解析容器元素未找到');
            return;
        }

        if (!window.quizResults || !Array.isArray(window.quizResults) || window.quizResults.length === 0) {
            console.warn('No quiz results available');
            container.innerHTML = '<div class="alert alert-warning">暂无解析数据，请先完成测验。</div>';
            section.style.display = 'block';
            container.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        section.style.display = 'block';
        let html = '';

        window.quizResults.forEach((result, index) => {
            const q = result.question;
            const statusClass = result.isCorrect ? 'correct' : 'wrong';
            const statusText = result.isCorrect ? '✓ 正确' : '✗ 错误';

            let optionsHtml = '';
            if (q.type === 'single') {
                optionsHtml = q.options.map((opt, i) => {
                    let extraClass = '';
                    let icon = '';
                    // 正确答案：显示绿色背景和勾
                    if (i === q.answer) {
                        extraClass = 'correct-answer';
                        icon = ' ✓';
                    }
                    // 用户选错的选项：显示红色背景和叉
                    else if (i === result.userAnswer && !result.isCorrect) {
                        extraClass = 'wrong-answer';
                        icon = ' ✗';
                    }
                    // 构建 class 属性，避免空字符串导致的空格问题
                    const classAttr = extraClass ? `option-label ${extraClass}` : 'option-label';
                    return `<div class="${classAttr}">
                        <span>${String.fromCharCode(65 + i)}. ${opt}${icon}</span>
                    </div>`;
                }).join('');
            } else {
                // 判断题
                const correctIsTrue = q.answer === true;
                const userChoseTrue = result.userAnswer === true;
                const userChoseFalse = result.userAnswer === false;

                // "正确"选项的样式
                const correctOptionClass = correctIsTrue ? 'correct-answer' : '';
                const correctOptionIcon = correctIsTrue ? ' ✓' : '';

                // "错误"选项的样式
                const wrongOptionClass = !correctIsTrue ? 'correct-answer' : '';
                const wrongOptionIcon = !correctIsTrue ? ' ✓' : '';

                // 如果用户选错了，标记其选择
                let userWrongClass = '';
                let userWrongIcon = '';
                if (!result.isCorrect) {
                    if (userChoseTrue && correctOptionClass === '') {
                        userWrongClass = 'wrong-answer';
                        userWrongIcon = ' ✗';
                    } else if (userChoseFalse && wrongOptionClass === '') {
                        userWrongClass = 'wrong-answer';
                        userWrongIcon = ' ✗';
                    }
                }

                optionsHtml = `
                    <div class="option-label ${correctOptionClass}${userWrongClass ? (correctOptionClass ? ' ' + userWrongClass : userWrongClass) : ''}">
                        <span>正确${correctOptionIcon}${userWrongClass && userChoseTrue ? userWrongIcon : ''}</span>
                    </div>
                    <div class="option-label ${wrongOptionClass}${userWrongClass && userChoseFalse ? (wrongOptionClass ? ' ' + userWrongClass : userWrongClass) : ''}">
                        <span>错误${wrongOptionIcon}${userWrongClass && userChoseFalse ? userWrongIcon : ''}</span>
                    </div>
                `;
            }

            html += `
                <div class="question-card ${statusClass}">
                    <div class="d-flex justify-content-between mb-2">
                        <span class="badge bg-primary">第 ${index + 1} 题</span>
                        <span class="badge ${result.isCorrect ? 'bg-success' : 'bg-danger'}">${statusText}</span>
                    </div>
                    <h5 class="mb-3">${q.question}</h5>
                    <div class="options mb-3">${optionsHtml}</div>
                    <div class="explanation show">
                        <strong><i class="bi bi-lightbulb"></i> 解析：</strong><br>
                        ${q.explanation}
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
        // 确保滚动到解析区域（使用 navbar offset）
        setTimeout(() => {
            const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 64;
            const elementTop = section.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: elementTop - navbarHeight - 20,
                behavior: 'smooth'
            });
        }, 100);
    }

    // 重试
    function retryQuiz() {
        userAnswers = {};
        timeRemaining = 40 * 60;

        document.getElementById('resultScreen').style.display = 'none';
        document.getElementById('startScreen').style.display = 'block';
    }

    // 暴露全局函数
    window.startQuiz = startQuiz;
    window.selectOption = selectOption;
    window.submitQuiz = submitQuiz;
    window.showExplanations = showExplanations;
    window.retryQuiz = retryQuiz;

})();
