// AI基础知识页面专用JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面
    initBasicsPage();
    
    // 添加交互功能
    addBasicsInteractions();
    
    // 平滑滚动到锚点
    setupSmoothScrolling();
});

function initBasicsPage() {
    // 设置当前活动导航项
    setActiveNavItem();
    
    // 添加页面动画
    addPageAnimations();
}

function setActiveNavItem() {
    // 根据当前页面设置导航项激活状态
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function addPageAnimations() {
    // 添加元素进入动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll('.content-card, .type-card, .app-card');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(element);
    });
}

function addBasicsInteractions() {
    // 侧边栏链接点击效果
    const sidebarLinks = document.querySelectorAll('.list-group-item');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 移除其他链接的active类
            sidebarLinks.forEach(l => l.classList.remove('active'));
            // 添加当前链接的active类
            this.classList.add('active');
        });
    });
    
    // 概念卡片悬停效果
    const conceptCards = document.querySelectorAll('.type-card, .app-card');
    conceptCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
        });
    });
    
    // 手风琴交互增强
    const accordionButtons = document.querySelectorAll('.accordion-button');
    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 添加点击反馈
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // 添加术语解释功能
    addTermExplanations();
}

function setupSmoothScrolling() {
    // 侧边栏目录链接平滑滚动
    const sidebarLinks = document.querySelectorAll('.list-group-item[href^="#"]');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // 计算偏移量（考虑固定导航栏）
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // 更新URL哈希（不触发页面跳转）
                history.pushState(null, null, `#${targetId}`);
            }
        });
    });
}

function addTermExplanations() {
    // 为关键术语添加解释功能
    const terms = {
        '人工智能': '让计算机模拟人类智能行为的技术',
        '机器学习': '让计算机从数据中自动学习的技术',
        '神经网络': '受大脑神经元结构启发的计算模型',
        '深度学习': '使用多层神经网络进行学习的技术',
        '算法': '解决问题的一系列明确指令',
        '数据': 'AI学习的基础材料',
        '模型': 'AI从数据中学到的知识表示',
        '训练': '让AI模型从数据中学习的过程'
    };
    
    // 查找页面中的术语并添加提示
    Object.keys(terms).forEach(term => {
        const regex = new RegExp(`(${term})`, 'g');
        const contentElements = document.querySelectorAll('.content-card p, .content-card li');
        
        contentElements.forEach(element => {
            if (regex.test(element.innerHTML)) {
                element.innerHTML = element.innerHTML.replace(
                    regex,
                    `<span class="term-highlight" data-term="${term}" title="${terms[term]}">$1</span>`
                );
            }
        });
    });
    
    // 添加术语提示交互
    const termHighlights = document.querySelectorAll('.term-highlight');
    termHighlights.forEach(term => {
        term.addEventListener('mouseenter', showTermTooltip);
        term.addEventListener('mouseleave', hideTermTooltip);
        term.addEventListener('click', explainTerm);
    });
}

function showTermTooltip(e) {
    const term = e.target.getAttribute('data-term');
    const explanation = e.target.getAttribute('title');
    
    // 创建工具提示
    const tooltip = document.createElement('div');
    tooltip.className = 'term-tooltip';
    tooltip.innerHTML = `
        <strong>${term}</strong><br>
        <small>${explanation}</small>
        <div class="tooltip-arrow"></div>
    `;
    
    // 定位工具提示
    const rect = e.target.getBoundingClientRect();
    tooltip.style.position = 'fixed';
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.top - 10}px`;
    tooltip.style.transform = 'translate(-50%, -100%)';
    
    // 添加到页面
    document.body.appendChild(tooltip);
    
    // 添加样式
    if (!document.querySelector('#term-tooltip-style')) {
        const style = document.createElement('style');
        style.id = 'term-tooltip-style';
        style.textContent = `
            .term-tooltip {
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                color: white;
                padding: 10px 15px;
                border-radius: 8px;
                font-size: 0.9rem;
                max-width: 200px;
                text-align: center;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                pointer-events: none;
            }
            
            .term-tooltip strong {
                display: block;
                margin-bottom: 5px;
            }
            
            .term-tooltip small {
                opacity: 0.9;
            }
            
            .tooltip-arrow {
                position: absolute;
                bottom: -5px;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                border-top: 5px solid var(--primary-color);
            }
            
            .term-highlight {
                background: linear-gradient(135deg, rgba(67, 97, 238, 0.1), rgba(76, 201, 240, 0.1));
                padding: 2px 5px;
                border-radius: 4px;
                cursor: help;
                transition: all 0.3s ease;
                border-bottom: 1px dashed var(--primary-color);
            }
            
            .term-highlight:hover {
                background: linear-gradient(135deg, rgba(67, 97, 238, 0.2), rgba(76, 201, 240, 0.2));
                color: var(--primary-color);
            }
        `;
        document.head.appendChild(style);
    }
    
    // 保存工具提示引用
    e.target._tooltip = tooltip;
}

function hideTermTooltip(e) {
    if (e.target._tooltip) {
        e.target._tooltip.remove();
        e.target._tooltip = null;
    }
}

function explainTerm(e) {
    const term = e.target.getAttribute('data-term');
    const explanation = AIUtils ? AIUtils.explainTerm(term) : '点击查看术语解释';
    
    // 创建解释弹窗
    const modal = document.createElement('div');
    modal.className = 'term-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h5><i class="bi bi-info-circle"></i> ${term} 解释</h5>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>${explanation}</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-sm btn-primary">知道了</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 添加样式
    if (!document.querySelector('#term-modal-style')) {
        const style = document.createElement('style');
        style.id = 'term-modal-style';
        style.textContent = `
            .term-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                animation: fadeIn 0.3s ease;
            }
            
            .modal-content {
                background: white;
                border-radius: 15px;
                max-width: 400px;
                width: 90%;
                animation: slideUp 0.3s ease;
            }
            
            .modal-header {
                padding: 20px;
                border-bottom: 1px solid #dee2e6;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .modal-header h5 {
                margin: 0;
                color: var(--primary-color);
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: var(--gray-color);
            }
            
            .modal-body {
                padding: 20px;
            }
            
            .modal-footer {
                padding: 15px 20px;
                border-top: 1px solid #dee2e6;
                text-align: right;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(50px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 添加关闭功能
    const closeBtn = modal.querySelector('.modal-close');
    const okBtn = modal.querySelector('.btn');
    
    function closeModal() {
        modal.style.animation = 'fadeOut 0.3s ease';
        modal.querySelector('.modal-content').style.animation = 'slideDown 0.3s ease';
        
        setTimeout(() => {
            modal.remove();
            
            // 添加消失动画
            if (!document.querySelector('#term-modal-animations')) {
                const animStyle = document.createElement('style');
                animStyle.id = 'term-modal-animations';
                animStyle.textContent = `
                    @keyframes fadeOut {
                        from { opacity: 1; }
                        to { opacity: 0; }
                    }
                    
                    @keyframes slideDown {
                        from {
                            opacity: 1;
                            transform: translateY(0);
                        }
                        to {
                            opacity: 0;
                            transform: translateY(50px);
                        }
                    }
                `;
                document.head.appendChild(animStyle);
            }
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    okBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// 测验功能
function checkQuiz() {
    const answers = {
        q1: 'B', // 让计算机模拟人类智能行为
        q2: 'B'  // 语音助手（如Siri）
    };
    
    let score = 0;
    let total = Object.keys(answers).length;
    
    // 检查答案
    Object.keys(answers).forEach(question => {
        const selected = document.querySelector(`input[name="${question}"]:checked`);
        if (selected && selected.nextElementSibling.textContent.trim().startsWith(answers[question])) {
            score++;
            // 标记正确答案
            selected.parentElement.classList.add('text-success');
            selected.parentElement.classList.add('fw-bold');
        } else if (selected) {
            // 标记错误答案
            selected.parentElement.classList.add('text-danger');
        }
    });
    
    // 显示结果
    const resultDiv = document.getElementById('quiz-result');
    const resultText = document.getElementById('result-text');
    
    let message = '';
    if (score === total) {
        message = `🎉 太棒了！你答对了 ${score}/${total} 题！你对AI基础知识掌握得很好！`;
    } else if (score >= total / 2) {
        message = `👍 不错！你答对了 ${score}/${total} 题。继续加油学习！`;
    } else {
        message = `📚 你答对了 ${score}/${total} 题。建议再复习一下上面的内容哦！`;
    }
    
    resultText.textContent = message;
    resultDiv.style.display = 'block';
    
    // 滚动到结果
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 导出函数供HTML使用
window.checkQuiz = checkQuiz;