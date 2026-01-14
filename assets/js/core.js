// NOAI 竞赛学习平台 - 核心JavaScript
(function() {
    'use strict';

    // ========== 每周内容解锁机制 ==========
    const WEEK_CONTENT_KEY = 'noai_week_unlock';
    const STUDY_START_KEY = 'noai_study_start_date';

    // 每周内容映射
    const WEEK_CONTENT = {
        1: ['python-basics', 'basics'],
        2: ['machine-learning'],
        3: ['neural-networks'],
        4: ['cnn-rnn'],
        5: ['generative-models', 'reinforcement'],
        6: ['llm-prompt', 'ai-agent']
    };

    // 获取当前应该解锁的周数
    function getCurrentUnlockedWeek() {
        const startDate = localStorage.getItem(STUDY_START_KEY);
        if (!startDate) {
            // 首次访问，记录开始时间
            const now = new Date();
            localStorage.setItem(STUDY_START_KEY, now.toISOString());
            return 1;
        }

        const start = new Date(startDate);
        const now = new Date();
        const daysPassed = Math.floor((now - start) / (1000 * 60 * 60 * 24));
        return Math.max(1, Math.min(6, Math.floor(daysPassed / 7) + 1));
    }

    // 检查页面是否已解锁
    function isPageUnlocked(pageId) {
        const currentWeek = getCurrentUnlockedWeek();
        const userUnlockedWeek = parseInt(localStorage.getItem(WEEK_CONTENT_KEY) || currentWeek);

        // 允许提前解锁下一周
        const maxWeek = Math.max(currentWeek, userUnlockedWeek);

        for (let week = 1; week <= Math.min(maxWeek + 1, 6); week++) {
            if (WEEK_CONTENT[week].includes(pageId)) return true;
        }
        return false;
    }

    // 完成本周内容，解锁下一周
    function unlockNextWeek() {
        const currentWeek = getCurrentUnlockedWeek();
        const userUnlockedWeek = parseInt(localStorage.getItem(WEEK_CONTENT_KEY) || currentWeek);
        const maxUnlockable = Math.min(userUnlockedWeek + 1, 6);

        if (maxUnlockable > userUnlockedWeek) {
            localStorage.setItem(WEEK_CONTENT_KEY, maxUnlockable);
            return true;
        }
        return false;
    }

    // 获取解锁状态信息
    function getUnlockInfo() {
        const currentWeek = getCurrentUnlockedWeek();
        const userUnlockedWeek = parseInt(localStorage.getItem(WEEK_CONTENT_KEY) || currentWeek);
        return {
            currentWeek,
            userUnlockedWeek,
            canUnlockNext: userUnlockedWeek < 6
        };
    }

    // 暴露解锁相关函数
    window.NOAIUnlock = {
        getCurrentWeek: getCurrentUnlockedWeek,
        isPageUnlocked: isPageUnlocked,
        unlockNextWeek: unlockNextWeek,
        getUnlockInfo: getUnlockInfo,
        WEEK_CONTENT: WEEK_CONTENT
    };

    // ========== 加载动画 ==========
    let loadingHidden = false;
    function hideLoading() {
        if (loadingHidden) return;
        loadingHidden = true;
        const el = document.getElementById('loadingOverlay');
        if (el) {
            el.classList.add('hidden');
            setTimeout(() => {
                if (el.parentNode) el.style.display = 'none';
            }, 300);
        }
    }

    // 页面加载完成后隐藏加载动画
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.addEventListener('load', hideLoading);
        });
    } else if (document.readyState === 'interactive') {
        window.addEventListener('load', hideLoading);
    } else {
        // 已经完全加载
        hideLoading();
    }

    // 最长3秒后强制隐藏（防止加载卡死）
    setTimeout(hideLoading, 3000);

    // ========== 导航栏效果 ==========
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) navbar.style.boxShadow = window.scrollY > 50 ? '0 4px 12px rgba(0,0,0,0.1)' : '';
    });

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const target = document.getElementById(href.substring(1));
                if (target) {
                    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 64;
                    window.scrollTo({ top: target.offsetTop - navbarHeight - 20, behavior: 'smooth' });
                }
            }
        });
    });

    // ========== 倒计时 ==========
    const examDate = new Date('2026-03-22T09:00:00+08:00');

    function updateCountdown() {
        const now = new Date();
        const diff = examDate - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const updateEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val >= 0 ? val : 0; };
        updateEl('days', days);
        updateEl('hours', String(hours).padStart(2, '0'));
        updateEl('minutes', String(minutes).padStart(2, '0'));
        updateEl('seconds', String(seconds).padStart(2, '0'));
        updateEl('footerDays', days);

        localStorage.setItem('noai_countdown_days', days >= 0 ? days : 0);
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ========== 进度追踪 ==========
    const STORAGE_KEY = 'noai_learning_progress';

    const ProgressManager = {
        getProgress: function() {
            try {
                const data = localStorage.getItem(STORAGE_KEY);
                return data ? JSON.parse(data) : this.initProgress();
            } catch (e) {
                return this.initProgress();
            }
        },
        initProgress: function() {
            const data = {
                visitedPages: [],
                moduleProgress: { 'python-basics': 0, 'basics': 0, 'machine-learning': 0, 'neural-networks': 0, 'cnn-rnn': 0, 'generative-models': 0, 'reinforcement': 0, 'llm-prompt': 0, 'ai-agent': 0, 'ethics': 0 },
                completedQuizzes: [], wrongQuestions: [], studyDays: [], lastStudyTime: null,
                weekQuizScores: {}  // 记录每周测验成绩
            };
            this.saveProgress(data);
            return data;
        },
        saveProgress: function(data) {
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
        },
        markPageVisited: function(pageId) {
            const progress = this.getProgress();
            if (!progress.visitedPages.includes(pageId)) {
                progress.visitedPages.push(pageId);
                progress.lastStudyTime = new Date().toISOString();
                const today = new Date().toDateString();
                if (!progress.studyDays.includes(today)) progress.studyDays.push(today);
                this.saveProgress(progress);
            }
        },
        updateModuleProgress: function(moduleId, percent) {
            const progress = this.getProgress();
            progress.moduleProgress[moduleId] = Math.min(100, Math.max(0, percent));
            progress.lastStudyTime = new Date().toISOString();
            this.saveProgress(progress);
        },
        recordQuiz: function(quizId, score, total, wrongAnswers, weekNum) {
            const progress = this.getProgress();
            const quizResult = { quizId, score, total, percent: Math.round((score / total) * 100), timestamp: new Date().toISOString() };
            progress.completedQuizzes.push(quizResult);

            // 记录每周测验成绩
            if (weekNum) {
                progress.weekQuizScores[weekNum] = quizResult;
            }

            if (wrongAnswers) {
                wrongAnswers.forEach(q => {
                    const existing = progress.wrongQuestions.find(wq => wq.questionId === q.questionId);
                    if (existing) { existing.reviewCount = (existing.reviewCount || 0) + 1; existing.lastWrong = new Date().toISOString(); }
                    else { progress.wrongQuestions.push({ questionId: q.questionId, question: q.question, yourAnswer: q.yourAnswer, correctAnswer: q.correctAnswer, firstWrong: new Date().toISOString(), reviewCount: 1 }); }
                });
            }
            progress.lastStudyTime = new Date().toISOString();
            this.saveProgress(progress);
            return quizResult;
        },
        getWeekQuizScore: function(weekNum) {
            const progress = this.getProgress();
            return progress.weekQuizScores[weekNum] || null;
        },
        getTotalProgress: function() {
            const progress = this.getProgress();
            const modules = Object.keys(progress.moduleProgress);
            const total = modules.reduce((sum, key) => sum + progress.moduleProgress[key], 0);
            return Math.round(total / modules.length);
        },
        getStudyDays: function() { return this.getProgress().studyDays.length; },
        getWrongQuestions: function() { return this.getProgress().wrongQuestions; },
        exportProgress: function() {
            const progress = this.getProgress();
            const blob = new Blob([JSON.stringify({ exportDate: new Date().toISOString(), ...progress }, null, 2)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'NOAI学习进度_' + new Date().toISOString().slice(0, 10) + '.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);
        }
    };

    // 标记当前页面已访问
    const currentPage = document.body.getAttribute('data-page') || window.location.pathname.split('/').pop().replace('.html', '') || 'index';
    if (currentPage !== 'index') ProgressManager.markPageVisited(currentPage);

    // 更新进度显示
    const totalProgress = ProgressManager.getTotalProgress();
    const progressEl = document.getElementById('totalProgress');
    if (progressEl) progressEl.textContent = totalProgress + '%';
    localStorage.setItem('noai_total_progress', totalProgress);

    window.NOAIProgress = ProgressManager;

    // ========== 工具函数 ==========
    window.copyCode = function(button) {
        const codeBlock = button.closest('.code-block');
        const code = codeBlock.querySelector('code').textContent;
        navigator.clipboard.writeText(code).then(() => {
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="bi bi-check"></i>';
            setTimeout(() => button.innerHTML = originalText, 2000);
        });
    };

    // 设置年份
    const yearElement = document.querySelector('footer p, .footer-text');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        const text = yearElement.textContent;
        if (text.includes('©')) yearElement.textContent = text.replace(/© \d+/, '© ' + currentYear);
    }

    // ========== 更新首页解锁状态 ==========
    function updateUnlockStatus() {
        const info = getUnlockInfo();
        const currentWeekEl = document.getElementById('currentWeek');
        if (currentWeekEl) currentWeekEl.textContent = info.currentWeek;

        // 更新每周时间线的解锁状态
        for (let week = 1; week <= 6; week++) {
            const item = document.querySelector(`.timeline-item[data-week="${week}"]`);
            if (!item) continue;

            const isUnlocked = week <= Math.max(info.currentWeek, info.userUnlockedWeek);
            const link = item.querySelector('a[href*="pages/"]');
            const lockBadge = item.querySelector('.lock-badge');

            if (isUnlocked) {
                item.classList.remove('week-locked');
                if (lockBadge) lockBadge.style.display = 'none';
                if (link) {
                    link.classList.remove('disabled-link');
                    link.classList.remove('btn-primary');
                    link.classList.add('btn-outline-primary');
                    link.onclick = null; // 移除禁用
                }
            } else {
                item.classList.add('week-locked');
                if (lockBadge) lockBadge.style.display = 'inline-flex';
                if (link) {
                    link.classList.add('disabled-link');
                    link.onclick = (e) => {
                        e.preventDefault();
                        alert('该内容尚未解锁，请完成本周测验后再试！');
                    };
                }
            }
        }
    }

    // 首页加载时更新解锁状态
    if (document.getElementById('study-plan')) {
        updateUnlockStatus();
    }

    window.updateUnlockStatus = updateUnlockStatus;

})();

