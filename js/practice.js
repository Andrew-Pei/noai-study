// 练习题库页面功能
(function() {
    'use strict';

    // 从NOAI真题中提取的题目数据
    const exam2025 = [
        {id:1,type:"single",question:"以下哪个不是Python的基本数据类型？",options:["int","float","char","bool"],answer:2},
        {id:2,type:"single",question:"机器学习中，监督学习的特点是？",options:["数据没有标签","数据有标签","无需训练","自动聚类"],answer:1},
        {id:3,type:"single",question:"CNN主要用于处理哪种类型的数据？",options:["文本序列","图像数据","音频信号","时间序列"],answer:1},
        {id:4,type:"single",question:"以下哪个是生成模型？",options:["SVM","决策树","GAN","逻辑回归"],answer:2},
        {id:5,type:"judge",question:"深度学习是机器学习的一个分支",answer:true},
        {id:6,type:"judge",question:"RNN只能处理固定长度的序列",answer:false},
        {id:7,type:"multi",question:"以下哪些属于CNN的组件？",options:["卷积层","池化层","全连接层","循环层"],answer:[0,1,2]},
        {id:8,type:"multi",question:"Transformer架构的核心包括？",options:["自注意力机制","编码器-解码器","循环连接"],answer:[0,1]}
    ];

    const moduleQuestions = {
        python: [
            {id:1,type:"single",question:"Python中定义函数使用关键字？",options:["function","func","def","define"],answer:2},
            {id:2,type:"judge",question:"Python是强类型语言",answer:false}
        ],
        ml: [
            {id:1,type:"single",question:"以下哪个是监督学习算法？",options:["K-means","线性回归","PCA","Apriori"],answer:1}
        ],
        dl: [
            {id:1,type:"single",question:"激活函数的作用是？",options:["减少参数","引入非线性","加快训练","防止过拟合"],answer:1}
        ],
        cnn: [
            {id:1,type:"single",question:"ResNet解决了什么问题？",options:["过拟合","梯度消失","数据不足","计算慢"],answer:1}
        ],
        gen: [
            {id:1,type:"single",question:"Stable Diffusion基于什么技术？",options:["GAN","VAE","扩散模型","RNN"],answer:2}
        ],
        rl: [
            {id:1,type:"single",question:"强化学习中，Agent通过什么学习？",options:["标签数据","奖励信号","聚类结果","相似度"],answer:1}
        ],
        llm: [
            {id:1,type:"single",question:"ChatGPT基于什么架构？",options:["RNN","CNN","Transformer","GAN"],answer:2}
        ],
        agent: [
            {id:1,type:"single",question:"AI Agent的核心特征不包括？",options:["感知","决策","行动","存储"],answer:3}
        ],
        ethics: [
            {id:1,type:"single",question:"AI伦理不包括以下哪个方面？",options:["隐私保护","算法公平","代码优化","责任归属"],answer:2}
        ]
    };

    let currentQuiz = [];
    let currentIndex = 0;
    let userAnswers = {};
    let quizModal;

    // 标签切换
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
            const tab = this.dataset.tab;
            if(tab === 'year') document.getElementById('yearTab').style.display = 'block';
            if(tab === 'module') document.getElementById('moduleTab').style.display = 'block';
            if(tab === 'wrong') { loadWrongQuestions(); document.getElementById('wrongTab').style.display = 'block'; }
        });
    });

    window.startExam = function(year) {
        currentQuiz = exam2025;
        currentIndex = 0;
        userAnswers = {};
        document.getElementById('quizTitle').textContent = `NOAI ${year} 真题`;
        showModal();
    };

    window.startModule = function(module) {
        currentQuiz = moduleQuestions[module] || [];
        currentIndex = 0;
        userAnswers = {};
        document.getElementById('quizTitle').textContent = getModuleName(module);
        showModal();
    };

    function getModuleName(m) {
        const names = {python:'Python基础',ml:'机器学习',dl:'深度学习',cnn:'CNN/RNN',gen:'生成模型',rl:'强化学习',llm:'LLM与提示',agent:'智能体',ethics:'伦理法律'};
        return names[m] || m;
    }

    function showModal() {
        quizModal = new bootstrap.Modal(document.getElementById('quizModal'));
        renderQuestion();
        quizModal.show();
    }

    function renderQuestion() {
        const q = currentQuiz[currentIndex];
        const container = document.getElementById('questionContainer');
        document.getElementById('quizProgress').textContent = `${currentIndex+1}/${currentQuiz.length}`;
        document.getElementById('prevBtn').disabled = currentIndex === 0;
        document.getElementById('nextBtn').classList.toggle('d-none', currentIndex === currentQuiz.length-1);
        document.getElementById('submitBtn').classList.toggle('d-none', currentIndex !== currentQuiz.length-1);

        let html = `<h5>${currentIndex+1}. ${q.question}</h5><div class="quiz-options">`;

        if(q.type === 'single') {
            q.options.forEach((opt,i) => {
                const checked = userAnswers[q.id] === i ? 'checked' : '';
                html += `<div class="form-check">
                    <input class="form-check-input" type="radio" name="q${q.id}" id="q${q.id}_${i}" value="${i}" ${checked} onchange="saveAnswer(${q.id},${i})">
                    <label class="form-check-label" for="q${q.id}_${i}">${String.fromCharCode(65+i)}. ${opt}</label>
                </div>`;
            });
        } else if(q.type === 'judge') {
            const trueChecked = userAnswers[q.id] === true ? 'checked' : '';
            const falseChecked = userAnswers[q.id] === false ? 'checked' : '';
            html += `<div class="form-check">
                <input class="form-check-input" type="radio" name="q${q.id}" id="q${q.id}_true" value="true" ${trueChecked} onchange="saveAnswer(${q.id},true)">
                <label class="form-check-label" for="q${q.id}_true">正确</label>
            </div><div class="form-check">
                <input class="form-check-input" type="radio" name="q${q.id}" id="q${q.id}_false" value="false" ${falseChecked} onchange="saveAnswer(${q.id},false)">
                <label class="form-check-label" for="q${q.id}_false">错误</label>
            </div>`;
        } else if(q.type === 'multi') {
            q.options.forEach((opt,i) => {
                const checked = (userAnswers[q.id]||[]).includes(i) ? 'checked' : '';
                html += `<div class="form-check">
                    <input class="form-check-input" type="checkbox" name="q${q.id}" id="q${q.id}_${i}" value="${i}" ${checked} onchange="saveMultiAnswer(${q.id},${i})">
                    <label class="form-check-label" for="q${q.id}_${i}">${String.fromCharCode(65+i)}. ${opt}</label>
                </div>`;
            });
        }
        html += '</div>';
        container.innerHTML = html;
    }

    window.saveAnswer = function(qid, val) { userAnswers[qid] = val; };
    window.saveMultiAnswer = function(qid, val) {
        if(!userAnswers[qid]) userAnswers[qid] = [];
        const idx = userAnswers[qid].indexOf(val);
        if(idx > -1) userAnswers[qid].splice(idx,1);
        else userAnswers[qid].push(val);
    };

    window.prevQuestion = function() {
        if(currentIndex > 0) { currentIndex--; renderQuestion(); }
    };

    window.nextQuestion = function() {
        if(currentIndex < currentQuiz.length-1) { currentIndex++; renderQuestion(); }
    };

    window.submitQuiz = function() {
        let correct = 0, wrong = [];
        currentQuiz.forEach(q => {
            const ans = userAnswers[q.id];
            let isCorrect = false;
            if(q.type === 'single' || q.type === 'judge') isCorrect = ans === q.answer;
            else if(q.type === 'multi') {
                if(Array.isArray(ans) && Array.isArray(q.answer)) {
                    isCorrect = ans.length === q.answer.length && ans.every(a => q.answer.includes(a));
                }
            }
            if(isCorrect) correct++;
            else wrong.push({questionId: q.id, question: q.question});
        });
        const percent = Math.round((correct/currentQuiz.length)*100);
        if(window.NOAIProgress) {
            window.NOAIProgress.recordQuiz('practice-'+Date.now(), correct, currentQuiz.length, wrong);
        }
        quizModal.hide();
        alert(`答题完成！\n正确: ${correct}/${currentQuiz.length} (${percent}%)`);
    };

    function loadWrongQuestions() {
        const list = document.getElementById('wrongQuestionsList');
        if(window.NOAIProgress) {
            const wrongs = window.NOAIProgress.getWrongQuestions();
            if(wrongs.length > 0) {
                let html = '<div class="row g-3">';
                wrongs.slice(0,10).forEach(w => {
                    html += `<div class="col-md-6"><div class="wrong-q-card"><h6>${w.question}</h6><p class="small mb-0"><span class="text-danger">你的答案: ${w.yourAnswer}</span> | <span class="text-success">正确答案: ${w.correctAnswer}</span></p></div></div>`;
                });
                html += '</div>';
                list.innerHTML = html;
            }
        }
    }
})();
