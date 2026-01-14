// AI学习中心 - 主JavaScript文件

(function() {
    'use strict';

    // 立即隐藏加载动画的函数
    function hideLoadingOverlay() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }

    // 页面加载完成后隐藏
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hideLoadingOverlay);
    } else {
        // DOM 已经加载完成
        hideLoadingOverlay();
    }

    // 额外保障：window load 事件后也隐藏
    window.addEventListener('load', function() {
        setTimeout(hideLoadingOverlay, 100);
    });

    // 最后保障：2秒后强制隐藏
    setTimeout(hideLoadingOverlay, 2000);

    // 导航栏滚动效果
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar && window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        } else if (navbar) {
            navbar.style.boxShadow = '';
        }
    });

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const targetElement = document.getElementById(href.substring(1));
                if (targetElement) {
                    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 76;
                    window.scrollTo({
                        top: targetElement.offsetTop - navbarHeight - 20,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 工具函数
    window.AIUtils = {
        explainTerm: function(term) {
            const explanations = {
                '人工智能': '人工智能是计算机科学的一个分支，研究如何让计算机模拟人类的智能行为。',
                '机器学习': '机器学习是AI的一个子领域，让计算机通过数据学习并改进性能。',
                '神经网络': '神经网络是受人类大脑启��的计算模型，用于识别模式和进行预测。',
                '深度学习': '深度学习是机器学习的一种，使用多层神经网络处理复杂的数据模式。'
            };
            return explanations[term] || '暂无解释';
        },
        getLearningTip: function() {
            const tips = [
                '每天坚持学习15分钟，效果比周末学2小时更好！',
                '尝试将学到的AI概念教给朋友，这样能加深理解。',
                '动手实践是最好的学习方式。'
            ];
            return tips[Math.floor(Math.random() * tips.length)];
        }
    };

    // 复制代码功能
    window.copyCode = function(button) {
        const codeBlock = button.closest('.code-block');
        const code = codeBlock.querySelector('code').textContent;
        navigator.clipboard.writeText(code).then(() => {
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="bi bi-check"></i>';
            setTimeout(() => {
                button.innerHTML = originalText;
            }, 2000);
        });
    };

    // 设置当前年份
    const yearElement = document.querySelector('footer p, .footer-text');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        // 只更新年份部分
        const text = yearElement.textContent;
        if (text.includes('©')) {
            yearElement.textContent = text.replace(/© \d+/, '© ' + currentYear);
        }
    }

})();
