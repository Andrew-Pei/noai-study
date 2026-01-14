// 互动学习页面专用JavaScript

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        try {
            // 初始化页面
            initInteractivePage();

            // 初始化所有演示
            initImageRecognitionDemo();
            initChatbotDemo();
            initRecommendationDemo();
        } catch (error) {
            // 静默处理错误,避免影响用户体验
        }
    });

function initInteractivePage() {
    // 设置当前活动导航项
    setActiveNavItem();
    
    // 初始化演示选择
    initDemoSelection();
    
    // 添加页面动画
    addPageAnimations();
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

function initDemoSelection() {
    const demoCards = document.querySelectorAll('.demo-card');
    const demoContents = document.querySelectorAll('.demo-content');
    
    demoCards.forEach(card => {
        card.addEventListener('click', function() {
            const demoType = this.getAttribute('data-demo');
            
            // 移除所有卡片的active类
            demoCards.forEach(c => c.classList.remove('active'));
            // 添加当前卡片的active类
            this.classList.add('active');
            
            // 隐藏所有演示内容
            demoContents.forEach(content => {
                content.classList.remove('active');
                content.style.display = 'none';
            });
            
            // 显示选中的演示内容
            const targetDemo = document.getElementById(`${demoType}-demo`);
            if (targetDemo) {
                targetDemo.style.display = 'block';
                setTimeout(() => {
                    targetDemo.classList.add('active');
                }, 10);
                
                // 滚动到演示区域
                targetDemo.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
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
    
    const animatedElements = document.querySelectorAll('.demo-card, .demo-header, .demo-explanation');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // 添加动画样式
    if (!document.querySelector('#interactive-animations')) {
        const style = document.createElement('style');
        style.id = 'interactive-animations';
        style.textContent = `
            .animate-in {
                animation: slideUp 0.6s ease forwards;
            }
            
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// 图像识别演示
function initImageRecognitionDemo() {
    // 文件上传处理
    const uploadBox = document.getElementById('uploadBox');
    const fileInput = document.getElementById('imageUpload');
    
    if (uploadBox && fileInput) {
        // 点击上传区域
        uploadBox.addEventListener('click', function() {
            fileInput.click();
        });
        
        // 拖放功能
        uploadBox.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = 'var(--primary-color)';
            this.style.background = 'rgba(67, 97, 238, 0.1)';
        });
        
        uploadBox.addEventListener('dragleave', function() {
            this.style.borderColor = '#dee2e6';
            this.style.background = 'white';
        });
        
        uploadBox.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = '#dee2e6';
            this.style.background = 'white';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleImageUpload(files[0]);
            }
        });
        
        // 文件选择变化
        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                handleImageUpload(this.files[0]);
            }
        });
    }
    
    // 示例图片点击
    const sampleItems = document.querySelectorAll('.sample-item');
    sampleItems.forEach(item => {
        item.addEventListener('click', function() {
            const imageType = this.getAttribute('data-image');
            simulateImageRecognition(imageType);
        });
    });
}

function handleImageUpload(file) {
    if (!file.type.match('image.*')) {
        alert('请选择图片文件！');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        // 显示预览
        const previewImage = document.getElementById('previewImage');
        previewImage.src = e.target.result;
        
        // 显示结果区域
        document.getElementById('resultsPlaceholder').style.display = 'none';
        document.getElementById('resultsContent').style.display = 'block';
        
        // 模拟识别过程
        simulateRecognitionProcess();
    };
    
    reader.readAsDataURL(file);
}

function simulateImageRecognition(imageType) {
    // 根据图片类型生成不同的预测结果
    const predictions = {
        'cat': [
            { label: '猫', confidence: 0.95 },
            { label: '狗', confidence: 0.03 },
            { label: '狐狸', confidence: 0.01 },
            { label: '兔子', confidence: 0.01 }
        ],
        'dog': [
            { label: '狗', confidence: 0.92 },
            { label: '狼', confidence: 0.05 },
            { label: '狐狸', confidence: 0.02 },
            { label: '猫', confidence: 0.01 }
        ],
        'car': [
            { label: '汽车', confidence: 0.88 },
            { label: '卡车', confidence: 0.08 },
            { label: '公交车', confidence: 0.03 },
            { label: '摩托车', confidence: 0.01 }
        ],
        'flower': [
            { label: '花', confidence: 0.90 },
            { label: '植物', confidence: 0.07 },
            { label: '树叶', confidence: 0.02 },
            { label: '草', confidence: 0.01 }
        ]
    };
    
    // 设置预览图片（使用CSS背景）
    const previewImage = document.getElementById('previewImage');
    const imageClasses = {
        'cat': 'cat-preview',
        'dog': 'dog-preview',
        'car': 'car-preview',
        'flower': 'flower-preview'
    };
    
    previewImage.src = '';
    previewImage.className = `img-fluid rounded ${imageClasses[imageType]}`;
    previewImage.style.width = '100%';
    previewImage.style.height = '200px';
    previewImage.style.objectFit = 'cover';
    
    // 显示结果区域
    document.getElementById('resultsPlaceholder').style.display = 'none';
    document.getElementById('resultsContent').style.display = 'block';
    
    // 显示预测结果
    displayPredictions(predictions[imageType] || predictions.cat);
}

function simulateRecognitionProcess() {
    // 显示加载状态
    const predictionList = document.getElementById('predictionList');
    predictionList.innerHTML = `
        <div class="text-center py-3">
            <div class="loading"></div>
            <p class="mt-2 small text-muted">AI正在分析图片...</p>
        </div>
    `;
    
    // 模拟网络延迟
    setTimeout(() => {
        // 生成随机预测结果
        const randomPredictions = generateRandomPredictions();
        displayPredictions(randomPredictions);
    }, 1500);
}

function generateRandomPredictions() {
    const labels = ['猫', '狗', '汽车', '花', '鸟', '树', '建筑', '人脸', '食物', '动物'];
    const predictions = [];
    
    // 生成4个预测结果
    for (let i = 0; i < 4; i++) {
        const randomLabel = labels[Math.floor(Math.random() * labels.length)];
        const confidence = Math.random() * 0.3 + 0.6; // 60%-90%的置信度
        
        predictions.push({
            label: randomLabel,
            confidence: Math.min(confidence, 0.95) // 不超过95%
        });
    }
    
    // 按置信度排序
    predictions.sort((a, b) => b.confidence - a.confidence);
    
    return predictions;
}

function displayPredictions(predictions) {
    const predictionList = document.getElementById('predictionList');
    
    let html = '';
    predictions.forEach(pred => {
        const confidencePercent = Math.round(pred.confidence * 100);
        html += `
            <div class="prediction-item">
                <div class="prediction-label">${pred.label}</div>
                <div class="prediction-confidence">${confidencePercent}%</div>
            </div>
            <div class="confidence-bar">
                <div class="confidence-fill" style="width: ${confidencePercent}%"></div>
            </div>
        `;
    });
    
    predictionList.innerHTML = html;
    
    // 添加动画效果
    const confidenceBars = document.querySelectorAll('.confidence-fill');
    confidenceBars.forEach(bar => {
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = bar.style.width;
        }, 100);
    });
}

// 聊天机器人演示
function initChatbotDemo() {
    // 初始化聊天历史
    loadChatHistory();
    
    // 添加输入框回车键支持
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

function loadChatHistory() {
    // 可以从本地存储加载聊天历史，这里使用默认消息
    const chatMessages = document.getElementById('chatMessages');
    // 默认消息已在HTML中定义
}

function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // 添加用户消息
    addUserMessage(message);
    
    // 清空输入框
    chatInput.value = '';
    
    // 模拟AI思考
    setTimeout(() => {
        const response = getAIResponse(message);
        addBotMessage(response);
        
        // 滚动到底部
        scrollChatToBottom();
    }, 1000);
}

function askQuickQuestion(question) {
    const chatInput = document.getElementById('chatInput');
    chatInput.value = question;
    sendMessage();
}

function addUserMessage(text) {
    const chatMessages = document.getElementById('chatMessages');
    const messageId = 'msg_' + Date.now();
    
    const messageHtml = `
        <div class="message user-message" id="${messageId}">
            <div class="message-avatar">
                <i class="bi bi-person"></i>
            </div>
            <div class="message-content">
                <div class="message-text">${text}</div>
                <div class="message-time">刚刚</div>
            </div>
        </div>
    `;
    
    chatMessages.insertAdjacentHTML('beforeend', messageHtml);
    
    // 滚动到底部
    scrollChatToBottom();
}

function addBotMessage(text) {
    const chatMessages = document.getElementById('chatMessages');
    const messageId = 'msg_' + Date.now();
    
    const messageHtml = `
        <div class="message bot-message" id="${messageId}">
            <div class="message-avatar">
                <i class="bi bi-robot"></i>
            </div>
            <div class="message-content">
                <div class="message-text">${text}</div>
                <div class="message-time">刚刚</div>
            </div>
        </div>
    `;
    
    chatMessages.insertAdjacentHTML('beforeend', messageHtml);
    
    // 滚动到底部
    scrollChatToBottom();
}

function getAIResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // 知识库
    const knowledgeBase = {
        // AI基础
        '什么是人工智能': '人工智能是计算机科学的一个分支，研究如何让计算机模拟人类的智能行为，包括学习、推理、感知、理解语言等能力。',
        '什么是ai': 'AI是人工智能的英文缩写，指的是让机器能够像人一样思考、学习和解决问题的技术。',
        '人工智能有什么应用': '人工智能应用广泛，包括：智能助手、图像识别、自动驾驶、医疗诊断、推荐系统、机器翻译等。',
        
        // 机器学习
        '什么是机器学习': '机器学习是AI的一个子领域，让计算机通过数据自动学习并改进，而无需明确编程。',
        '机器学习有哪些类型': '机器学习主要分为三类：监督学习、无监督学习和强化学习。',
        '监督学习是什么': '监督学习使用带有标签的数据进行训练，就像有老师指导的学习，用于分类和回归问题。',
        '无监督学习是什么': '无监督学习使用没有标签的数据，让机器自己发现数据中的模式，用于聚类和降维。',
        '强化学习是什么': '强化学习通过试错和奖励机制学习最佳行为策略，就像训练宠物一样。',
        
        // 神经网络
        '神经网络是什么': '神经网络是受人类大脑神经元结构启发的计算模型，用于识别复杂模式和进行预测。',
        '神经网络如何工作': '神经网络由多层神经元组成，数据从输入层经过隐藏层处理，最后输出结果。',
        '深度学习是什么': '深度学习是机器学习的一种，使用多层神经网络处理复杂的数据模式。',
        '神经网络有什么应用': '神经网络广泛应用于图像识别、语音识别、自然语言处理、游戏AI等领域。',
        
        // 其他
        '你好': '你好！我是AI学习助手，很高兴为你解答关于人工智能的问题。',
        '谢谢': '不客气！如果还有其他问题，随时问我哦！',
        '再见': '再见！希望你在AI学习的道路上越走越远！'
    };
    
    // 查找匹配的回答
    for (const [question, answer] of Object.entries(knowledgeBase)) {
        if (lowerMessage.includes(question.toLowerCase())) {
            return answer;
        }
    }
    
    // 如果没有匹配，使用默认回答
    const defaultResponses = [
        '这个问题很有趣！让我想想怎么解释...',
        '我还在学习中，这个问题有点难倒我了。',
        '你可以尝试问一些关于AI基础、机器学习或神经网络的问题。',
        '这个问题涉及的内容比较广泛，你能具体一点吗？',
        '我主要擅长回答AI相关的问题，比如定义、原理、应用等。'
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

function scrollChatToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 推荐系统演示
function initRecommendationDemo() {
    // 初始化类型选择
    initGenreSelection();
    
    // 生成模拟评分历史
    generateRatingHistory();
}

function initGenreSelection() {
    const genreOptions = document.querySelectorAll('.genre-option');
    
    genreOptions.forEach(option => {
        option.addEventListener('click', function() {
            // 切换选中状态
            this.classList.toggle('selected');
            
            // 更新选择状态显示
            updateSelectedGenres();
        });
    });
}

function updateSelectedGenres() {
    const selectedGenres = document.querySelectorAll('.genre-option.selected');
    const selectedCount = selectedGenres.length;

    // 可以在这里添加选中类型的计数显示
}

function generateRatingHistory() {
    const ratingsList = document.querySelector('.ratings-list');
    if (!ratingsList) return;
    
    const movies = [
        { title: '星际穿越', genre: '科幻', rating: 5 },
        { title: '肖申克的救赎', genre: '剧情', rating: 5 },
        { title: '疯狂动物城', genre: '动画', rating: 4 },
        { title: '速度与激情', genre: '动作', rating: 4 },
        { title: '恐怖游轮', genre: '恐怖', rating: 3 }
    ];
    
    let html = '';
    movies.forEach(movie => {
        const stars = '★'.repeat(movie.rating) + '☆'.repeat(5 - movie.rating);
        html += `
            <div class="rating-item">
                <span class="movie-title">${movie.title}</span>
                <span class="rating-stars">${stars}</span>
            </div>
        `;
    });
    
    ratingsList.innerHTML = html;
}

function generateRecommendations() {
    const selectedGenres = document.querySelectorAll('.genre-option.selected');
    
    if (selectedGenres.length === 0) {
        alert('请至少选择一个电影类型！');
        return;
    }
    
    // 获取选中的类型
    const selectedGenreNames = Array.from(selectedGenres).map(g => g.getAttribute('data-genre'));
    
    // 显示加载状态
    document.getElementById('recPlaceholder').style.display = 'none';
    const recList = document.getElementById('recommendationList');
    recList.style.display = 'block';
    recList.innerHTML = `
        <div class="text-center py-4">
            <div class="loading"></div>
            <p class="mt-2 small text-muted">正在根据你的喜好生成推荐...</p>
        </div>
    `;
    
    // 模拟推荐过程
    setTimeout(() => {
        const recommendations = generateMovieRecommendations(selectedGenreNames);
        displayRecommendations(recommendations);
    }, 2000);
}

function generateMovieRecommendations(selectedGenres) {
    // 电影数据库
    const movieDatabase = [
        { title: '流浪地球', genres: ['科幻', '冒险'], rating: 4.5, score: 0.95 },
        { title: '哪吒之魔童降世', genres: ['动画', '喜剧'], rating: 4.8, score: 0.92 },
        { title: '战狼2', genres: ['动作', '战争'], rating: 4.7, score: 0.90 },
        { title: '你好，李焕英', genres: ['喜剧', '剧情'], rating: 4.6, score: 0.88 },
        { title: '红海行动', genres: ['动作', '战争'], rating: 4.5, score: 0.85 },
        { title: '唐人街探案3', genres: ['喜剧', '悬疑'], rating: 4.3, score: 0.82 },
        { title: '我和我的祖国', genres: ['剧情', '历史'], rating: 4.4, score: 0.80 },
        { title: '中国机长', genres: ['剧情', '灾难'], rating: 4.2, score: 0.78 },
        { title: '刺杀小说家', genres: ['动作', '奇幻'], rating: 4.1, score: 0.75 },
        { title: '温暖的抱抱', genres: ['喜剧', '剧情'], rating: 4.0, score: 0.72 }
    ];
    
    // 根据选择的类型过滤和评分
    const recommendations = movieDatabase.map(movie => {
        // 计算匹配分数
        let matchScore = 0;
        selectedGenres.forEach(genre => {
            if (movie.genres.includes(getGenreChineseName(genre))) {
                matchScore += 0.3;
            }
        });
        
        // 结合评分
        const finalScore = matchScore + (movie.rating - 4) * 0.1;
        
        return {
            ...movie,
            matchScore: Math.min(Math.max(finalScore, 0.6), 0.95)
        };
    });
    
    // 按匹配分数排序
    recommendations.sort((a, b) => b.matchScore - a.matchScore);
    
    // 返回前5个推荐
    return recommendations.slice(0, 5);
}

function getGenreChineseName(englishName) {
    const genreMap = {
        'action': '动作',
        'comedy': '喜剧',
        'drama': '剧情',
        'scifi': '科幻',
        'horror': '恐怖',
        'animation': '动画'
    };
    
    return genreMap[englishName] || englishName;
}

function displayRecommendations(recommendations) {
    const recList = document.getElementById('recommendationList');
    
    let html = '';
    recommendations.forEach((movie, index) => {
        const scorePercent = Math.round(movie.matchScore * 100);
        const stars = '★'.repeat(Math.round(movie.rating)) + '☆'.repeat(5 - Math.round(movie.rating));
        
        html += `
            <div class="recommendation-item">
                <div class="movie-poster"></div>
                <div class="movie-info">
                    <div class="movie-title">${movie.title}</div>
                    <div class="movie-genres">${movie.genres.join(' · ')}</div>
                    <div class="movie-rating">
                        <span class="rating-value">${movie.rating.toFixed(1)}</span>
                        <span class="rating-stars">${stars}</span>
                    </div>
                </div>
                <div class="recommendation-score">${scorePercent}%匹配</div>
            </div>
        `;
    });
    
    recList.innerHTML = html;
    
    // 添加动画效果
    const recItems = recList.querySelectorAll('.recommendation-item');
    recItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// 重置所有演示
function resetAllDemos() {
    if (confirm('确定要重置所有演示吗？当前进度将丢失。')) {
        // 重置图像识别演示
        document.getElementById('resultsPlaceholder').style.display = 'block';
        document.getElementById('resultsContent').style.display = 'none';
        document.getElementById('previewImage').src = '';
        
        // 重置聊天机器人演示
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = `
            <div class="message bot-message">
                <div class="message-avatar">
                    <i class="bi bi-robot"></i>
                </div>
                <div class="message-content">
                    <div class="message-text">
                        你好！我是AI学习助手，我可以回答关于人工智能、机器学习、神经网络等方面的问题。试试问我："什么是机器学习？" 或者 "神经网络有什么应用？"
                    </div>
                    <div class="message-time">刚刚</div>
                </div>
            </div>
        `;
        
        // 重置推荐系统演示
        document.getElementById('recPlaceholder').style.display = 'block';
        document.getElementById('recommendationList').style.display = 'none';

        // 重置类型选择
        const genreOptions = document.querySelectorAll('.genre-option');
        genreOptions.forEach(option => option.classList.remove('selected'));

        alert('所有演示已重置！');
    }
}

// 导出函数供HTML使用
window.sendMessage = sendMessage;
window.askQuickQuestion = askQuickQuestion;
window.generateRecommendations = generateRecommendations;
window.resetAllDemos = resetAllDemos;

})();