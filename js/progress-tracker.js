// 学习进度追踪功能 (使用 LocalStorage)
(function() {
    'use strict';

    const STORAGE_KEY = 'noai_learning_progress';
    const QUIZ_RESULTS_KEY = 'noai_quiz_results';

    // 学习进度管理器
    const ProgressManager = {
        // 获取所有进度数据
        getProgress: function() {
            try {
                const data = localStorage.getItem(STORAGE_KEY);
                return data ? JSON.parse(data) : this.initProgress();
            } catch (e) {
                return this.initProgress();
            }
        },

        // 初始化进度数据
        initProgress: function() {
            const initialData = {
                // 页面访问记录
                visitedPages: [],
                // 各模块学习进度 (0-100)
                moduleProgress: {
                    'python-basics': 0,
                    'basics': 0,
                    'machine-learning': 0,
                    'neural-networks': 0,
                    'cnn-rnn': 0,
                    'generative-models': 0,
                    'reinforcement': 0,
                    'llm-prompt': 0,
                    'ai-agent': 0,
                    'ethics': 0
                },
                // 练习题完成情况
                completedQuizzes: [],
                // 错题记录
                wrongQuestions: [],
                // 学习天数
                studyDays: [],
                // 最后学习时间
                lastStudyTime: null
            };
            this.saveProgress(initialData);
            return initialData;
        },

        // 保存进度
        saveProgress: function(data) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            } catch (e) {
                // 如果存储失败，可能是配额已满
            }
        },

        // 记录页面访问
        markPageVisited: function(pageId) {
            const progress = this.getProgress();
            if (!progress.visitedPages.includes(pageId)) {
                progress.visitedPages.push(pageId);
                progress.lastStudyTime = new Date().toISOString();
                this.recordStudyDay(progress);
                this.saveProgress(progress);
            }
            return progress;
        },

        // 更新模块进度
        updateModuleProgress: function(moduleId, percent) {
            const progress = this.getProgress();
            progress.moduleProgress[moduleId] = Math.min(100, Math.max(0, percent));
            progress.lastStudyTime = new Date().toISOString();
            this.recordStudyDay(progress);
            this.saveProgress(progress);
            return progress;
        },

        // 记录练习题结果
        recordQuiz: function(quizId, score, total, wrongAnswers) {
            const progress = this.getProgress();
            const result = {
                quizId: quizId,
                score: score,
                total: total,
                percent: Math.round((score / total) * 100),
                timestamp: new Date().toISOString()
            };
            progress.completedQuizzes.push(result);

            // 记录错题
            if (wrongAnswers && wrongAnswers.length > 0) {
                wrongAnswers.forEach(function(q) {
                    // 检查是否已存在
                    const existing = progress.wrongQuestions.find(function(wq) {
                        return wq.questionId === q.questionId;
                    });
                    if (existing) {
                        existing.reviewCount = (existing.reviewCount || 0) + 1;
                        existing.lastWrong = new Date().toISOString();
                    } else {
                        progress.wrongQuestions.push({
                            questionId: q.questionId,
                            question: q.question,
                            yourAnswer: q.yourAnswer,
                            correctAnswer: q.correctAnswer,
                            firstWrong: new Date().toISOString(),
                            reviewCount: 1
                        });
                    }
                });
            }

            progress.lastStudyTime = new Date().toISOString();
            this.recordStudyDay(progress);
            this.saveProgress(progress);
            return progress;
        },

        // 记录学习日期
        recordStudyDay: function(progress) {
            const today = new Date().toDateString();
            if (!progress.studyDays.includes(today)) {
                progress.studyDays.push(today);
            }
        },

        // 获取总体进度百分比
        getTotalProgress: function() {
            const progress = this.getProgress();
            const modules = Object.keys(progress.moduleProgress);
            const total = modules.reduce(function(sum, key) {
                return sum + progress.moduleProgress[key];
            }, 0);
            return Math.round(total / modules.length);
        },

        // 获取学习天数
        getStudyDays: function() {
            const progress = this.getProgress();
            return progress.studyDays.length;
        },

        // 获取错题列表
        getWrongQuestions: function() {
            const progress = this.getProgress();
            return progress.wrongQuestions;
        },

        // 导出进度数据（用于发送给老师）
        exportProgress: function() {
            const progress = this.getProgress();
            const exportData = {
                exportDate: new Date().toISOString(),
                ...progress
            };
            const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                type: 'application/json'
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'NOAI学习进度_' + new Date().toISOString().slice(0, 10) + '.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        },

        // 导入进度数据
        importProgress: function(jsonData) {
            try {
                const data = JSON.parse(jsonData);
                this.saveProgress(data);
                return true;
            } catch (e) {
                return false;
            }
        }
    };

    // 当前页面标记
    const currentPage = document.body.getAttribute('data-page') ||
                        window.location.pathname.split('/').pop().replace('.html', '') ||
                        'index';

    // 标记当前页面已访问
    if (currentPage !== 'index') {
        ProgressManager.markPageVisited(currentPage);
    }

    // 更新首页的进度显示
    function updateProgressDisplay() {
        const totalProgress = ProgressManager.getTotalProgress();
        const studyDays = ProgressManager.getStudyDays();

        const progressEl = document.getElementById('totalProgress');
        if (progressEl) {
            progressEl.textContent = totalProgress + '%';
        }

        // 保存供其他页面使用
        localStorage.setItem('noai_total_progress', totalProgress);
        localStorage.setItem('noai_study_days', studyDays);
    }

    // 页面加载完成后更新进度显示
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateProgressDisplay);
    } else {
        updateProgressDisplay();
    }

    // 导出全局对象
    window.NOAIProgress = ProgressManager;
})();
