// 机器学习页面专用JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面
    initMLPage();
    
    // 初始化演示
    initRegressionDemo();
    
    // 添加交互功能
    addMLInteractions();
});

function initMLPage() {
    // 设置当前活动导航项
    setActiveNavItem();
    
    // 添加页面动画
    addPageAnimations();
    
    // 初始化滑块事件
    initSliders();
}

function setActiveNavItem() {
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
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.content-card, .type-card, .process-step');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // 添加动画样式
    if (!document.querySelector('#ml-animations')) {
        const style = document.createElement('style');
        style.id = 'ml-animations';
        style.textContent = `
            .animate-in {
                animation: slideUp 0.6s ease forwards;
            }
            
            .process-step {
                opacity: 0;
                transform: translateY(20px);
            }
            
            @keyframes slideUp {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .example-card {
                transition: all 0.3s ease;
                padding: 15px;
                border-radius: 10px;
                background: white;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
                height: 100%;
                text-align: center;
            }
            
            .example-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
            }
            
            .example-card i {
                font-size: 2rem;
                margin-bottom: 10px;
            }
            
            .type-tags {
                margin-top: 10px;
            }
            
            .type-tags .badge {
                margin-right: 5px;
                font-size: 0.7rem;
            }
            
            .learning-example {
                background: linear-gradient(135deg, rgba(25, 135, 84, 0.1), rgba(13, 110, 253, 0.1));
                padding: 20px;
                border-radius: 10px;
                margin-top: 20px;
            }
            
            .example-steps {
                margin-top: 15px;
            }
            
            .step {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
            }
            
            .step-number {
                width: 30px;
                height: 30px;
                background: var(--success-color);
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 10px;
                font-weight: bold;
                flex-shrink: 0;
            }
            
            .ml-visualization {
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
            }
            
            .viz-title {
                font-weight: bold;
                color: var(--success-color);
                margin-bottom: 15px;
                text-align: center;
            }
            
            .viz-flow {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }
            
            .flow-item {
                text-align: center;
                padding: 10px;
            }
            
            .flow-icon {
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, var(--success-color), var(--primary-color));
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.2rem;
                margin: 0 auto 10px;
            }
            
            .flow-arrow {
                color: var(--success-color);
                font-size: 1.5rem;
                font-weight: bold;
            }
            
            .applications ul {
                list-style: none;
                padding-left: 0;
            }
            
            .applications li {
                padding: 5px 0;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .applications li:last-child {
                border-bottom: none;
            }
            
            .process-steps {
                position: relative;
                padding-left: 40px;
            }
            
            .process-steps::before {
                content: '';
                position: absolute;
                left: 20px;
                top: 0;
                bottom: 0;
                width: 3px;
                background: linear-gradient(to bottom, var(--success-color), var(--primary-color));
            }
            
            .process-step {
                position: relative;
                margin-bottom: 30px;
                display: flex;
                align-items: flex-start;
            }
            
            .step-number {
                position: absolute;
                left: -40px;
                top: 0;
                width: 40px;
                height: 40px;
                background: var(--success-color);
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 1.2rem;
                box-shadow: 0 4px 10px rgba(25, 135, 84, 0.3);
                z-index: 1;
            }
            
            .step-content {
                margin-left: 20px;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 10px;
                flex: 1;
            }
            
            .step-content h5 {
                color: var(--success-color);
                margin-bottom: 5px;
            }
            
            .demo-container {
                display: flex;
                flex-wrap: wrap;
                gap: 30px;
            }
            
            .demo-explanation {
                flex: 1;
                min-width: 300px;
            }
            
            .demo-visualization {
                flex: 1;
                min-width: 300px;
            }
            
            .viz-container {
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
                text-align: center;
            }
            
            #regressionCanvas {
                max-width: 100%;
                height: auto;
            }
            
            .demo-controls {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 10px;
            }
            
            .form-range {
                width: 100%;
            }
        `;
        document.head.appendChild(style);
    }
}

function initSliders() {
    // 初始化数据点滑块
    const dataPointsSlider = document.getElementById('dataPoints');
    const pointsValue = document.getElementById('pointsValue');
    
    if (dataPointsSlider && pointsValue) {
        dataPointsSlider.addEventListener('input', function() {
            pointsValue.textContent = this.value;
        });
    }
    
    // 初始化噪声水平滑块
    const noiseSlider = document.getElementById('noiseLevel');
    const noiseValue = document.getElementById('noiseValue');
    
    if (noiseSlider && noiseValue) {
        noiseSlider.addEventListener('input', function() {
            noiseValue.textContent = this.value;
        });
    }
}

function addMLInteractions() {
    // 侧边栏链接点击效果
    const sidebarLinks = document.querySelectorAll('.list-group-item');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                sidebarLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // 平滑滚动到目标
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // 类型卡片悬停效果
    const typeCards = document.querySelectorAll('.type-card');
    typeCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.03)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
        });
    });
    
    // 示例卡片悬停效果
    const exampleCards = document.querySelectorAll('.example-card');
    exampleCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.2)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });
    });
}

// 线性回归演示
let regressionChart = null;
let dataPoints = [];
let model = { slope: 0, intercept: 0 };

function initRegressionDemo() {
    // 初始化Canvas
    const canvas = document.getElementById('regressionCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // 生成初始数据
    generateData();
    
    // 绘制初始图表
    drawInitialChart();
}

function generateData() {
    const points = parseInt(document.getElementById('dataPoints').value) || 50;
    const noise = parseFloat(document.getElementById('noiseLevel').value) || 0.3;
    
    // 生成随机数据点
    dataPoints = [];
    const trueSlope = 2; // 真实斜率
    const trueIntercept = 10; // 真实截距
    
    for (let i = 0; i < points; i++) {
        const x = Math.random() * 100;
        const noiseValue = (Math.random() - 0.5) * 20 * noise;
        const y = trueSlope * x + trueIntercept + noiseValue;
        
        dataPoints.push({ x, y });
    }
    
    // 更新图表
    updateChart();
    
    // 更新模型信息
    document.getElementById('modelInfo').innerHTML = `
        <i class="bi bi-info-circle"></i> 已生成 ${points} 个数据点，噪声水平：${noise.toFixed(1)}
        <br><small>真实关系：y = 2x + 10 + 噪声</small>
    `;
}

function drawInitialChart() {
    const canvas = document.getElementById('regressionCanvas');
    const ctx = canvas.getContext('2d');
    
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制坐标轴
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    
    // X轴
    ctx.beginPath();
    ctx.moveTo(50, 250);
    ctx.lineTo(350, 250);
    ctx.stroke();
    
    // Y轴
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(50, 250);
    ctx.stroke();
    
    // 坐标轴标签
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.fillText('X', 360, 250);
    ctx.fillText('Y', 40, 40);
    
    // 网格线
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i <= 10; i++) {
        const x = 50 + i * 30;
        ctx.beginPath();
        ctx.moveTo(x, 50);
        ctx.lineTo(x, 250);
        ctx.stroke();
        
        const y = 250 - i * 20;
        ctx.beginPath();
        ctx.moveTo(50, y);
        ctx.lineTo(350, y);
        ctx.stroke();
    }
    
    // 提示文字
    ctx.fillStyle = '#4361ee';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('点击"训练模型"开始演示', canvas.width / 2, canvas.height / 2);
}

function updateChart() {
    const canvas = document.getElementById('regressionCanvas');
    const ctx = canvas.getContext('2d');
    
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制坐标轴和网格
    drawGrid(ctx);
    
    // 绘制数据点
    dataPoints.forEach(point => {
        const x = 50 + point.x * 3; // 缩放X坐标
        const y = 250 - point.y * 2; // 缩放Y坐标（反转Y轴）
        
        ctx.fillStyle = '#4361ee';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // 如果模型已训练，绘制回归线
    if (model.slope !== 0 || model.intercept !== 0) {
        const x1 = 0;
        const y1 = model.slope * x1 + model.intercept;
        const x2 = 100;
        const y2 = model.slope * x2 + model.intercept;
        
        const canvasX1 = 50 + x1 * 3;
        const canvasY1 = 250 - y1 * 2;
        const canvasX2 = 50 + x2 * 3;
        const canvasY2 = 250 - y2 * 2;
        
        ctx.strokeStyle = '#f72585';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(canvasX1, canvasY1);
        ctx.lineTo(canvasX2, canvasY2);
        ctx.stroke();
        
        // 显示方程
        ctx.fillStyle = '#f72585';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`y = ${model.slope.toFixed(2)}x + ${model.intercept.toFixed(2)}`, 60, 40);
    }
}

function drawGrid(ctx) {
    // 坐标轴
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    
    // X轴
    ctx.beginPath();
    ctx.moveTo(50, 250);
    ctx.lineTo(350, 250);
    ctx.stroke();
    
    // Y轴
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(50, 250);
    ctx.stroke();
    
    // 坐标轴标签
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.fillText('X', 360, 250);
    ctx.fillText('Y', 40, 40);
    
    // 刻度
    for (let i = 0; i <= 10; i++) {
        const x = 50 + i * 30;
        ctx.beginPath();
        ctx.moveTo(x, 245);
        ctx.lineTo(x, 255);
        ctx.stroke();
        ctx.fillText(i * 10, x, 265);
        
        const y = 250 - i * 20;
        ctx.beginPath();
        ctx.moveTo(45, y);
        ctx.lineTo(55, y);
        ctx.stroke();
        ctx.fillText(i * 10, 30, y + 3);
    }
    
    // 网格线
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i <= 10; i++) {
        const x = 50 + i * 30;
        ctx.beginPath();
        ctx.moveTo(x, 50);
        ctx.lineTo(x, 250);
        ctx.stroke();
        
        const y = 250 - i * 20;
        ctx.beginPath();
        ctx.moveTo(50, y);
        ctx.lineTo(350, y);
        ctx.stroke();
    }
}

function trainModel() {
    if (dataPoints.length === 0) {
        generateData();
    }
    
    // 简单的线性回归实现（最小二乘法）
    const n = dataPoints.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    
    dataPoints.forEach(point => {
        sumX += point.x;
        sumY += point.y;
        sumXY += point.x * point.y;
        sumX2 += point.x * point.x;
    });
    
    // 计算斜率和截距
    model.slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    model.intercept = (sumY - model.slope * sumX) / n;
    
    // 计算R²（决定系数）
    let ssTotal = 0, ssResidual = 0;
    const meanY = sumY / n;
    
    dataPoints.forEach(point => {
        const predicted = model.slope * point.x + model.intercept;
        ssTotal += Math.pow(point.y - meanY, 2);
        ssResidual += Math.pow(point.y - predicted, 2);
    });
    
    const rSquared = 1 - (ssResidual / ssTotal);
    
    // 更新图表
    updateChart();
    
    // 显示训练结果
    document.getElementById('modelInfo').innerHTML = `
        <i class="bi bi-check-circle text-success"></i> 模型训练完成！
        <br><strong>回归方程：</strong> y = ${model.slope.toFixed(2)}x + ${model.intercept.toFixed(2)}
        <br><strong>拟合优度（R²）：</strong> ${rSquared.toFixed(3)}
        <br><small>R²越接近1，表示模型拟合越好</small>
    `;
    
    // 添加动画效果
    const infoDiv = document.getElementById('modelInfo');
    infoDiv.classList.add('animate__animated', 'animate__pulse');
    setTimeout(() => {
        infoDiv.classList.remove('animate__animated', 'animate__pulse');
    }, 1000);
}

// 导出函数供HTML使用
window.generateData = generateData;
window.trainModel = trainModel;