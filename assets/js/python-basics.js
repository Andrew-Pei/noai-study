// Python 基础页面交互功能
(function() {
    'use strict';

    // 复制代码功能
    window.copyCode = function(button) {
        const codeBlock = button.closest('.code-block');
        const code = codeBlock.querySelector('code').textContent;

        navigator.clipboard.writeText(code).then(function() {
            const icon = button.querySelector('i');
            icon.className = 'bi bi-check';
            button.classList.add('copied');

            setTimeout(function() {
                icon.className = 'bi bi-clipboard';
                button.classList.remove('copied');
            }, 2000);
        }).catch(function() {
            // 降级方案
            const textarea = document.createElement('textarea');
            textarea.value = code;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        });
    };

    // Python 练习题
    const pythonQuestions = [
        {
            id: 1,
            question: "以下哪个是正确的 Python 变量名？",
            options: ["2nd_var", "my-var", "my_var", "class"],
            answer: 2,
            explanation: "Python 变量名不能以数字开头，不能包含连字符，且不能使用关键字。"
        },
        {
            id: 2,
            question: "Python 中列表的索引从几开始？",
            options: ["1", "0", "-1", "任意"],
            answer: 1,
            explanation: "Python 中列表索引从 0 开始。"
        },
        {
            id: 3,
            question: "以下哪个关键字用于定义函数？",
            options: ["function", "func", "def", "define"],
            answer: 2,
            explanation: "Python 使用 'def' 关键字定义函数。"
        },
        {
            id: 4,
            question: "要导入 numpy 模块并使用别名 np，应该写：",
            options: ["import numpy as np", "import numpy np", "from numpy import np", "include numpy as np"],
            answer: 0,
            explanation: "正确语法是 'import numpy as np'。"
        },
        {
            id: 5,
            question: "以下哪个不是 Python 的基本数据类型？",
            options: ["int", "str", "char", "bool"],
            answer: 2,
            explanation: "Python 中没有 char 类型，单个字符也是 str 类型。"
        },
        {
            id: 6,
            question: "如何创建一个空列表？",
            options: ["list = {}", "list = []", "list = ()", "list = new List()"],
            answer: 1,
            explanation: "Python 中使用 [] 创建列表，{} 创建字典，() 创建元组。"
        },
        {
            id: 7,
            question: "range(5) 会生成什么序列？",
            options: ["[1,2,3,4,5]", "[0,1,2,3,4]", "[1,2,3,4]", "[0,1,2,3,4,5]"],
            answer: 1,
            explanation: "range(5) 生成从 0 到 4 的整数序列，不包含 5。"
        },
        {
            id: 8,
            question: "NumPy 中，np.array([[1,2],[3,4]]).shape 的结果是？",
            options: ["(2,)", "(4,)", "(2,2)", "(4,1)"],
            answer: 2,
            explanation: "这是一个 2 行 2 列的二维数组，所以 shape 是 (2, 2)。"
        }
    ];

    // 加载练习题
    function loadQuiz() {
        const container = document.getElementById('pythonQuiz');
        if (!container) return;

        let html = '';
        pythonQuestions.forEach(function(q, index) {
            html += `
                <div class="quiz-question mb-4" data-question="${q.id}">
                    <h5>问题 ${index + 1}：${q.question}</h5>
                    <div class="quiz-options">
            `;
            q.options.forEach(function(opt, i) {
                html += `
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="pq${q.id}" id="pq${q.id}_a${i}" value="${i}">
                        <label class="form-check-label" for="pq${q.id}_a${i}">
                            ${String.fromCharCode(65 + i)}. ${opt}
                        </label>
                    </div>
                `;
            });
            html += `
                    </div>
                    <div class="quiz-explanation d-none" id="explanation${q.id}"></div>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    // 检查答案
    window.checkPythonQuiz = function() {
        let correct = 0;
        let wrong = [];

        pythonQuestions.forEach(function(q) {
            const selected = document.querySelector(`input[name="pq${q.id}"]:checked`);
            const explanationEl = document.getElementById(`explanation${q.id}`);

            if (selected) {
                const answer = parseInt(selected.value);
                if (answer === q.answer) {
                    correct++;
                    explanationEl.className = 'quiz-explanation mt-2 alert alert-success';
                    explanationEl.textContent = '✓ 正确！' + q.explanation;
                } else {
                    wrong.push({
                        questionId: q.id,
                        question: q.question,
                        yourAnswer: q.options[answer],
                        correctAnswer: q.options[q.answer]
                    });
                    explanationEl.className = 'quiz-explanation mt-2 alert alert-danger';
                    explanationEl.textContent = '✗ 错误。正确答案是 ' + String.fromCharCode(65 + q.answer) + '。' + q.explanation;
                }
            } else {
                wrong.push({
                    questionId: q.id,
                    question: q.question,
                    yourAnswer: '未作答',
                    correctAnswer: q.options[q.answer]
                });
                explanationEl.className = 'quiz-explanation mt-2 alert alert-warning';
                explanationEl.textContent = '未作答。正确答案是 ' + String.fromCharCode(65 + q.answer) + '。';
            }
            explanationEl.classList.remove('d-none');
        });

        // 显示结果
        const resultEl = document.getElementById('quizResult');
        const percent = Math.round((correct / pythonQuestions.length) * 100);
        resultEl.className = 'mt-3';
        resultEl.style.display = 'block';

        if (percent >= 80) {
            resultEl.innerHTML = `
                <div class="alert alert-success">
                    <h5><i class="bi bi-trophy"></i> 优秀！</h5>
                    <p>你答对了 ${correct} / ${pythonQuestions.length} 题 (${percent}%)</p>
                </div>
            `;
        } else if (percent >= 60) {
            resultEl.innerHTML = `
                <div class="alert alert-warning">
                    <h5><i class="bi bi-check-circle"></i> 及格！</h5>
                    <p>你答对了 ${correct} / ${pythonQuestions.length} 题 (${percent}%)，继续加油！</p>
                </div>
            `;
        } else {
            resultEl.innerHTML = `
                <div class="alert alert-danger">
                    <h5><i class="bi bi-arrow-repeat"></i> 需要再复习</h5>
                    <p>你答对了 ${correct} / ${pythonQuestions.length} 题 (${percent}%)，建议重新学习本章节。</p>
                </div>
            `;
        }

        // 记录到学习进度
        if (window.NOAIProgress) {
            window.NOAIProgress.recordQuiz('python-basics', correct, pythonQuestions.length, wrong);
            window.NOAIProgress.updateModuleProgress('python-basics', percent);
        }

        // 滚动到结果
        resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            loadQuiz();
        });
    } else {
        loadQuiz();
    }

    // 添加代码块样式
    const style = document.createElement('style');
    style.textContent = `
        .code-block {
            background: #1e1e1e;
            border-radius: 8px;
            overflow: hidden;
            margin: 15px 0;
        }
        .code-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 15px;
            background: #2d2d2d;
            color: #888;
            font-size: 0.85rem;
        }
        .code-block pre {
            margin: 0;
            padding: 15px;
            overflow-x: auto;
        }
        .code-block code {
            color: #d4d4d4;
            font-family: 'Fira Code', 'Consolas', monospace;
            font-size: 0.9rem;
            line-height: 1.5;
        }
        .copy-btn {
            background: none;
            border: none;
            color: #888;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 4px;
            transition: all 0.2s;
        }
        .copy-btn:hover {
            background: #3e3e3e;
            color: #fff;
        }
        .copy-btn.copied {
            color: #4cc9f0 !important;
        }
        .page-header-python {
            background: linear-gradient(135deg, #306998, #FFD43B);
        }
        .page-icon {
            font-size: 3rem;
            opacity: 0.9;
        }
        .feature-box {
            text-align: center;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
        }
        .feature-box i {
            font-size: 2rem;
            margin-bottom: 10px;
        }
        .feature-box h5 {
            margin-bottom: 5px;
        }
        .table code {
            background: #e9ecef;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.9em;
        }
        .quiz-question {
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        .quiz-question h5 {
            margin-bottom: 15px;
        }
        .form-check {
            margin-bottom: 8px;
        }
        .quiz-explanation {
            padding: 10px 15px;
            border-radius: 6px;
        }
    `;
    document.head.appendChild(style);
})();
