// NOAI 比赛倒计时功能
(function() {
    'use strict';

    // NOAI 2026 初赛日期
    const examDate = new Date('2026-03-22T09:00:00+08:00');

    function updateCountdown() {
        try {
            const now = new Date();
            const diff = examDate - now;

            // 计算天、时、分、秒
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            // 更新主倒计时显示
            const daysEl = document.getElementById('days');
            const hoursEl = document.getElementById('hours');
            const minutesEl = document.getElementById('minutes');
            const secondsEl = document.getElementById('seconds');

            if (daysEl) daysEl.textContent = days >= 0 ? days : 0;
            if (hoursEl) hoursEl.textContent = hours >= 0 ? String(hours).padStart(2, '0') : '00';
            if (minutesEl) minutesEl.textContent = minutes >= 0 ? String(minutes).padStart(2, '0') : '00';
            if (secondsEl) secondsEl.textContent = seconds >= 0 ? String(seconds).padStart(2, '0') : '00';

            // 更新 Footer 倒计时
            const footerDaysEl = document.getElementById('footerDays');
            if (footerDaysEl) footerDaysEl.textContent = days >= 0 ? days : 0;

            // 保存到 localStorage 供其他页面使用
            localStorage.setItem('noai_countdown_days', days >= 0 ? days : 0);

            // 如果比赛已经开始，显示提示
            if (diff <= 0) {
                const countdownLabel = document.querySelector('.countdown-label');
                if (countdownLabel) {
                    countdownLabel.innerHTML = '<i class="bi bi-trophy-fill me-2"></i>NOAI 比赛进行中！';
                }
            }
        } catch (error) {
            // 静默处理错误
        }
    }

    // 页面加载完成后启动倒计时
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            updateCountdown();
            setInterval(updateCountdown, 1000);
        });
    } else {
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // 导出函数供其他页面使用
    window.NOAICountdown = {
        getExamDate: function() { return examDate; },
        getDaysRemaining: function() {
            const diff = examDate - new Date();
            return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
        }
    };
})();
