// CNN 与 RNN 页面交互功能
(function() {
    'use strict';

    // 练习题
    const cnnRnnQuestions = [
        {
            id: 1,
            question: "CNN 主要用于处理哪种类型的数据？",
            options: ["文本序列", "图像数据", "音频信号", "时间序列"],
            answer: 1,
            explanation: "CNN（卷积神经网络）主要用于处理具有网格结构的数据，如图像。"
        },
        {
            id: 2,
            question: "CNN 中，卷积核的作用是什么？",
            options: ["减少数据维度", "提取局部特征", "增加数据维度", "分类输出"],
            answer: 1,
            explanation: "卷积核通过滑动在图像上提取局部特征，��边缘、纹理等。"
        },
        {
            id: 3,
            question: "ResNet 引入的什么结构解决了深层网络训练问题？",
            options: ["注意力机制", "残差连接", "门控机制", "归一化层"],
            answer: 1,
            explanation: "ResNet 引入残差连接（跳跃连接），解决了深层网络的梯度消失问题。"
        },
        {
            id: 4,
            question: "RNN 相比 CNN 的主要特点是？",
            options: ["处理速度更快", "参数更少", "具有记忆能力", "结构更简单"],
            answer: 2,
            explanation: "RNN 通过隐藏状态传递历史信息，具有记忆能力，适合处理序列数据。"
        },
        {
            id: 5,
            question: "LSTM 中的遗忘门的作用是？",
            options: ["存储新信息", "输出隐藏状态", "决定丢弃哪些信息", "提取特征"],
            answer: 2,
            explanation: "遗忘门控制从记忆单元中丢弃哪些信息，帮助网络学习长期依赖。"
        },
        {
            id: 6,
            question: "以下哪个是目标检测任务？",
            options: ["判断图像中是否有猫", "识别图像中所有物体的位置和类别", "给图像分类", "生成图像描述"],
            answer: 1,
            explanation: "目标检测需要定位并识别图像中的多个物体，YOLO 是典型模型。"
        },
        {
            id: 7,
            question: "GRU 相比 LSTM 的优势是？",
            options: ["性能更好", "参数更少训练更快", "记忆更长", "结构更复杂"],
            answer: 1,
            explanation: "GRU 是 LSTM 的简化版本，门控机制更简单，参数更少，训练更快。"
        },
        {
            id: 8,
            question: "YOLO 是什么类型的算法？",
            options: ["图像分类", "单阶段目标检测", "语义分割", "图像生成"],
            answer: 1,
            explanation: "YOLO (You Only Look Once) 是单阶段目标检测算法，可以实现实时检测。"
        }
    ];

    // 加载练习题
    function loadQuiz() {
        const container = document.getElementById('cnnRnnQuiz');
        if (!container) return;

        let html = '';
        cnnRnnQuestions.forEach(function(q, index) {
            html += `
                <div class="quiz-question mb-4" data-question="${q.id}">
                    <h5>问题 ${index + 1}：${q.question}</h5>
                    <div class="quiz-options">
            `;
            q.options.forEach(function(opt, i) {
                html += `
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="cq${q.id}" id="cq${q.id}_a${i}" value="${i}">
                        <label class="form-check-label" for="cq${q.id}_a${i}">
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
    window.checkCnnRnnQuiz = function() {
        let correct = 0;
        let wrong = [];

        cnnRnnQuestions.forEach(function(q) {
            const selected = document.querySelector(`input[name="cq${q.id}"]:checked`);
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

        const resultEl = document.getElementById('quizResult');
        const percent = Math.round((correct / cnnRnnQuestions.length) * 100);
        resultEl.className = 'mt-3';
        resultEl.style.display = 'block';

        if (percent >= 80) {
            resultEl.innerHTML = `
                <div class="alert alert-success">
                    <h5><i class="bi bi-trophy"></i> 优秀！</h5>
                    <p>你答对了 ${correct} / ${cnnRnnQuestions.length} 题 (${percent}%)</p>
                </div>
            `;
        } else if (percent >= 60) {
            resultEl.innerHTML = `
                <div class="alert alert-warning">
                    <h5><i class="bi bi-check-circle"></i> 及格！</h5>
                    <p>你答对了 ${correct} / ${cnnRnnQuestions.length} 题 (${percent}%)，继续加油！</p>
                </div>
            `;
        } else {
            resultEl.innerHTML = `
                <div class="alert alert-danger">
                    <h5><i class="bi bi-arrow-repeat"></i> 需要再复习</h5>
                    <p>你答对了 ${correct} / ${cnnRnnQuestions.length} 题 (${percent}%)，建议重新学习本章节。</p>
                </div>
            `;
        }

        if (window.NOAIProgress) {
            window.NOAIProgress.recordQuiz('cnn-rnn', correct, cnnRnnQuestions.length, wrong);
            window.NOAIProgress.updateModuleProgress('cnn-rnn', percent);
        }

        resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadQuiz);
    } else {
        loadQuiz();
    }

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .page-header-dl {
            background: linear-gradient(135deg, #667eea, #764ba2);
        }
        .concept-card {
            text-align: center;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
            height: 100%;
        }
        .concept-card i {
            font-size: 2rem;
            margin-bottom: 10px;
        }
        .concept-card h5 {
            margin-bottom: 8px;
        }
        .concept-card p {
            margin-bottom: 0;
        }
        .info-box {
            background: #e7f3ff;
            border-left: 4px solid var(--primary-color);
            padding: 15px 20px;
            border-radius: 8px;
        }
        .info-box h6 {
            margin-bottom: 10px;
        }
        .cnn-diagram {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
            gap: 10px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
        }
        .cnn-layer {
            padding: 10px 15px;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            border-radius: 8px;
            font-size: 0.9rem;
            text-align: center;
            white-space: nowrap;
        }
        .cnn-output {
            background: var(--success-color);
        }
        .cnn-arrow {
            color: var(--gray-color);
        }
        .pool-type {
            padding: 15px;
            background: #f8f9fa;
            border-radius: 10px;
        }
        .pool-type h6 {
            margin-bottom: 10px;
            color: var(--primary-color);
        }
        .pool-example {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-top: 10px;
        }
        .pool-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 5px;
        }
        .pool-grid span {
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: white;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            font-size: 0.85rem;
        }
        .pool-result {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 5px;
        }
        .pool-result span {
            width: 35px;
            height: 35px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: white;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            font-size: 0.85rem;
        }
        .pool-result span.highlight {
            background: var(--warning-color);
            color: white;
            font-weight: bold;
        }
        .timeline-simple {
            position: relative;
            padding-left: 100px;
        }
        .arch-item {
            position: relative;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            margin-bottom: 15px;
        }
        .arch-year {
            position: absolute;
            left: -85px;
            top: 50%;
            transform: translateY(-50%);
            background: var(--primary-color);
            color: white;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 500;
        }
        .arch-item h5 {
            margin-bottom: 5px;
            color: var(--primary-color);
        }
        .arch-item p {
            margin-bottom: 0;
        }
        .rnn-diagram {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
            gap: 15px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
        }
        .rnn-step {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .rnn-label {
            font-weight: 500;
            color: var(--primary-color);
        }
        .rnn-box {
            width: 60px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            border-radius: 8px;
            font-size: 0.8rem;
        }
        .gate-card {
            text-align: center;
            padding: 15px;
            border-radius: 10px;
            color: white;
        }
        .gate-card h6 {
            margin-bottom: 5px;
        }
        .gate-card p {
            margin-bottom: 0;
            font-size: 0.85rem;
        }
        .forget-gate { background: #dc3545; }
        .input-gate { background: #198754; }
        .cell-gate { background: #0dcaf0; }
        .output-gate { background: #ffc107; color: #000; }
        .app-card {
            padding: 20px;
            border-radius: 10px;
        }
        .cnn-app {
            background: linear-gradient(135deg, #667eea20, #764ba220);
            border: 1px solid #667eea;
        }
        .rnn-app {
            background: linear-gradient(135deg, #f093fb20, #f5576c20);
            border: 1px solid #f093fb;
        }
        .app-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
        }
        .app-header i {
            font-size: 1.5rem;
            color: var(--primary-color);
        }
        .app-card ul li {
            padding: 5px 0;
        }
        .app-card ul li i {
            color: var(--success-color);
            margin-right: 8px;
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
