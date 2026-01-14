// 我的进度页面
(function() {
    'use strict';

    function updateProgress() {
        if(!window.NOAIProgress) return;
        const progress = window.NOAIProgress.getProgress();

        document.getElementById('studyDays').textContent = progress.studyDays.length;
        document.getElementById('totalQuizzes').textContent = progress.completedQuizzes.length;
        document.getElementById('wrongCount').textContent = progress.wrongQuestions.length;

        const avgScore = progress.completedQuizzes.length > 0 ?
            Math.round(progress.completedQuizzes.reduce((s,q) => s+q.percent,0)/progress.completedQuizzes.length) : 0;
        document.getElementById('avgScore').textContent = avgScore + '%';

        updateModuleProgress(progress.moduleProgress);
        updateRecentQuizzes(progress.completedQuizzes);
        updateWrongQuestions(progress.wrongQuestions);
    }

    function updateModuleProgress(moduleProgress) {
        const container = document.getElementById('moduleProgress');
        const names = {
            'python-basics':'Python基础','basics':'AI概念','machine-learning':'机器学习',
            'neural-networks':'神经网络','cnn-rnn':'CNN/RNN','generative-models':'生成模型',
            'reinforcement':'强化学习','llm-prompt':'LLM与提示','ai-agent':'智能体','ethics':'伦理'
        };
        let html = '';
        for(let key in moduleProgress) {
            const name = names[key] || key;
            const pct = moduleProgress[key];
            const colorClass = pct >= 70 ? 'bg-success' : pct >= 40 ? 'bg-warning' : 'bg-danger';
            html += `<div class="progress-item mb-3">
                <div class="d-flex justify-content-between mb-1"><span>${name}</span><span>${pct}%</span></div>
                <div class="progress"><div class="progress-bar ${colorClass}" style="width:${pct}%"></div></div>
            </div>`;
        }
        container.innerHTML = html;
    }

    function updateRecentQuizzes(quizzes) {
        const container = document.getElementById('recentQuizzes');
        if(quizzes.length === 0) {
            container.innerHTML = '<p class="text-muted text-center py-3">暂无练习记录</p>';
            return;
        }
        const recent = quizzes.slice(-5).reverse();
        let html = '<div class="quiz-history">';
        recent.forEach(q => {
            const date = new Date(q.timestamp).toLocaleDateString('zh-CN');
            const statusClass = q.percent >= 80 ? 'success' : q.percent >= 60 ? 'warning' : 'danger';
            html += `<div class="history-item d-flex justify-content-between align-items-center py-2 border-bottom">
                <span class="small">${date} - ${q.quizId}</span>
                <span class="badge bg-${statusClass}">${q.percent}%</span>
            </div>`;
        });
        html += '</div>';
        container.innerHTML = html;
    }

    function updateWrongQuestions(wrongs) {
        const container = document.getElementById('wrongQuestionsList');
        if(wrongs.length === 0) {
            container.innerHTML = '<p class="text-muted text-center py-3">暂无错题，太棒了！</p>';
            return;
        }
        let html = '<div class="row g-3">';
        wrongs.slice(0,10).forEach(w => {
            html += `<div class="col-md-6"><div class="wrong-q-card">
                <h6 class="mb-2">${w.question.substring(0,50)}...</h6>
                <p class="small mb-0"><span class="text-danger">你的答案: ${w.yourAnswer}</span> | <span class="text-success">正确答案: ${w.correctAnswer}</span></p>
                <small class="text-muted">错误次数: ${w.reviewCount || 1}</small>
            </div></div>`;
        });
        html += '</div>';
        container.innerHTML = html;
    }

    window.exportProgress = function() {
        if(window.NOAIProgress) window.NOAIProgress.exportProgress();
    };

    window.clearProgress = function() {
        if(confirm('确定要清空所有学习数据吗？此操作不可恢复！')) {
            localStorage.removeItem('noai_learning_progress');
            localStorage.removeItem('noai_quiz_results');
            alert('数据已清空');
            updateProgress();
        }
    };

    if(document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateProgress);
    } else {
        updateProgress();
    }

    const style = document.createElement('style');
    style.textContent = `
        .page-header-progress { background: linear-gradient(135deg, #11998e, #38ef7d); }
        .stat-card { display: flex; align-items: center; gap: 15px; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .stat-icon { width: 50px; height: 50px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; }
        .stat-info h3 { margin-bottom: 0; font-size: 2rem; }
        .stat-info p { margin-bottom: 0; color: #6c757d; }
        .progress-card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); height: 100%; }
        .wrong-q-card { background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #dc3545; }
        .history-item:last-child { border-bottom: none !important; }
        .practice-tabs { display: flex; gap: 10px; justify-content: center; }
        .tab-btn { padding: 10px 30px; border: none; background: #e9ecef; border-radius: 25px; cursor: pointer; transition: all 0.3s; }
        .tab-btn.active { background: var(--primary-color); color: white; }
        .exam-card { background: white; padding: 25px; border-radius: 12px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.05); position: relative; }
        .exam-badge { position: absolute; top: -10px; right: -10px; background: var(--warning-color); color: white; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
        .exam-meta { display: flex; justify-content: center; gap: 20px; margin: 15px 0; color: #6c757d; }
        .module-card { background: white; padding: 20px; border-radius: 12px; text-align: center; cursor: pointer; transition: all 0.3s; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .module-card:hover { transform: translateY(-5px); box-shadow: 0 5px 20px rgba(0,0,0,0.1); }
        .module-card i { font-size: 2rem; color: var(--primary-color); margin-bottom: 10px; }
        .module-card h6 { margin-bottom: 5px; }
        .module-card p { color: #6c757d; margin-bottom: 0; }
    `;
    document.head.appendChild(style);
})();
