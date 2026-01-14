// AI学习中心 - 主JavaScript文件

// 使用立即执行函数避免全局污染
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        try {
            // 初始化函数
            initWebsite();

            // 添加滚动动画效果
            addScrollAnimations();

            // 添加交互功能
            addInteractiveFeatures();
        } catch (error) {
            // 静默处理错误,避免影响用户体验
        }
    });

function initWebsite() {
    // 隐藏加载指示器 - 添加多重保障
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        // 方法1: 监听window.onload事件
        window.addEventListener('load', function() {
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
            }, 500);
        });
        
        // 方法2: 备用定时器，确保即使load事件未触发也会隐藏
        setTimeout(() => {
            if (loadingOverlay && !loadingOverlay.classList.contains('hidden')) {
                loadingOverlay.classList.add('hidden');
            }
        }, 3000);
        
        // 方法3: 立即尝试隐藏（如果页面已经加载完成）
        if (document.readyState === 'complete') {
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
            }, 300);
        }
        
        // 方法4: 添加点击关闭功能（作为最后的保障）
        loadingOverlay.addEventListener('click', function() {
            loadingOverlay.classList.add('hidden');
        });
        
        // 添加提示文字
        const spinner = loadingOverlay.querySelector('.loading-spinner');
        if (spinner) {
            spinner.title = '点击关闭加载动画';
            spinner.style.cursor = 'pointer';
        }
    }
    
    // 设置当前年份
    const yearElement = document.querySelector('footer p:first-child');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = `© ${currentYear} AI学习中心. 保留所有权利.`;
    }
    
    // 添加页面加载动画
    document.body.classList.add('fade-in');
}

function addScrollAnimations() {
    // 使用Intersection Observer API添加滚动动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll('.card, .timeline-item, .demo-preview');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

function addInteractiveFeatures() {
    // 卡片悬停效果增强
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // 导航栏滚动效果
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
            navbar.style.padding = '10px 0';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            navbar.style.padding = '15px 0';
        }
    });
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            try {
                const href = this.getAttribute('href');
                
                // 如果是页面内锚点链接
                if (href && href.startsWith('#') && href.length > 1) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
                        window.scrollTo({
                            top: targetElement.offsetTop - navbarHeight - 20,
                            behavior: 'smooth'
                        });
                    }
                }
            } catch (error) {
                // 静默处理滚动错误
            }
        });
    });
    
    // 添加AI学习提示
    addLearningTips();
}

function addLearningTips() {
    // 创建学习提示容器
    const tipContainer = document.createElement('div');
    tipContainer.className = 'learning-tip';

    const tipContent = document.createElement('div');
    tipContent.className = 'tip-content';

    const icon = document.createElement('i');
    icon.className = 'bi bi-lightbulb';

    const text = document.createTextNode('学习提示：每天学习15分钟，坚持21天形成习惯！');

    const closeBtn = document.createElement('button');
    closeBtn.className = 'tip-close';
    const closeIcon = document.createElement('i');
    closeIcon.className = 'bi bi-x';
    closeBtn.appendChild(closeIcon);

    tipContent.appendChild(icon);
    tipContent.appendChild(text);
    tipContent.appendChild(closeBtn);
    tipContainer.appendChild(tipContent);
    
    // 添加到页面
    document.body.appendChild(tipContainer);
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .learning-tip {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            max-width: 300px;
            animation: slideInRight 0.5s ease;
        }
        
        .tip-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .tip-content i {
            font-size: 1.2rem;
            color: var(--warning-color);
        }
        
        .tip-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 5px;
            margin-left: auto;
        }
        
        .tip-close:hover {
            opacity: 0.8;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    // 关闭提示功能
    const closeButton = tipContainer.querySelector('.tip-close');
    closeButton.addEventListener('click', function() {
        tipContainer.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => {
            tipContainer.remove();
        }, 500);
    });
    
    // 添加消失动画
    const slideOutStyle = document.createElement('style');
    slideOutStyle.textContent = `
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(slideOutStyle);
}

// AI相关工具函数
const AIUtils = {
    // 简单的AI术语解释
    explainTerm: function(term) {
        const explanations = {
            '人工智能': '人工智能是计算机科学的一个分支，研究如何让计算机模拟人类的智能行为。',
            '机器学习': '机器学习是AI的一个子领域，让计算机通过数据学习并改进性能，而无需明确编程。',
            '神经网络': '神经网络是受人类大脑启发的计算模型，用于识别模式和进行预测。',
            '深度学习': '深度学习是机器学习的一种，使用多层神经网络处理复杂的数据模式。',
            '自然语言处理': '让计算机理解、解释和生成人类语言的技术。'
        };
        
        return explanations[term] || '抱歉，暂时没有这个术语的解释。';
    },
    
    // 生成学习进度提示
    getLearningTip: function() {
        const tips = [
            '每天坚持学习15分钟，效果比周末学2小时更好！',
            '尝试将学到的AI概念教给朋友，这样能加深理解。',
            '动手实践是最好的学习方式，多尝试互动演示。',
            '遇到困难时，可以休息一下再回来思考。',
            '学习AI就像学习新语言，需要时间和耐心。'
        ];
        
        return tips[Math.floor(Math.random() * tips.length)];
    },
    
    // 简单的AI演示功能
    simpleAIDemo: function(type) {
        switch(type) {
            case 'image-recognition':
                return '这是一个简单的图像识别演示。AI通过分析图片中的特征来识别物体。';
            case 'chatbot':
                return '这是一个简单的聊天机器人。它使用自然语言处理技术来理解和回应你的问题。';
            case 'recommendation':
                return '这是一个推荐系统演示。AI根据你的喜好推荐相关内容。';
            default:
                return '选择一种AI演示类型来体验。';
        }
    }
};

// 导出工具函数供其他页面使用
window.AIUtils = AIUtils;