// NOAI 学习平台 - 后端服务器
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'noai-secret-key-2026';

// 中间件
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500', 'file://'],
    credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));
app.use(cookieParser());

// 初始化数据库
const db = new sqlite3.Database('./server/students.db');

// 创建表
db.serialize(() => {
    // 用户表
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        student_name TEXT,
        class_name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME
    )`);

    // 学习进度表
    db.run(`CREATE TABLE IF NOT EXISTS progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        week_num INTEGER NOT NULL,
        module_id TEXT,
        progress_percent INTEGER DEFAULT 0,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, week_num, module_id),
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

    // 测验成绩表
    db.run(`CREATE TABLE IF NOT EXISTS quiz_scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        quiz_id TEXT NOT NULL,
        score INTEGER NOT NULL,
        total_questions INTEGER NOT NULL,
        wrong_answers TEXT,
        week_num INTEGER,
        completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

    // 访问记录表
    db.run(`CREATE TABLE IF NOT EXISTS visits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        page_id TEXT NOT NULL,
        visit_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

    // 索引
    db.run('CREATE INDEX IF NOT EXISTS idx_progress_user ON progress(user_id)');
    db.run('CREATE INDEX IF NOT EXISTS idx_quiz_user ON quiz_scores(user_id)');
});

// 身份验证中间件
function authenticateToken(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: '未登录' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Token无效' });
        }
        req.userId = decoded.userId;
        next();
    });
}

// ========== API 路由 ==========

// 注册
app.post('/api/register', async (req, res) => {
    try {
        const { username, password, studentName, className } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: '用户名和密码不能为空' });
        }

        // 检查用户是否已存在
        db.get('SELECT id FROM users WHERE username = ?', [username], (err, row) => {
            if (err) {
                return res.status(500).json({ error: '数据库错误' });
            }
            if (row) {
                return res.status(409).json({ error: '用户名已存在' });
            }

            // 创建新用户
            const hashedPassword = bcrypt.hashSync(password, 10);
            db.run(
                'INSERT INTO users (username, password, student_name, class_name) VALUES (?, ?, ?, ?)',
                [username, hashedPassword, studentName || '', className || ''],
                function(err) {
                    if (err) {
                        return res.status(500).json({ error: '注册失败' });
                    }

                    // 生成JWT token
                    const token = jwt.sign({ userId: this.lastID }, JWT_SECRET, { expiresIn: '30d' });

                    res.cookie('token', token, {
                        httpOnly: true,
                        maxAge: 30 * 24 * 60 * 60 * 1000
                    });

                    res.json({
                        message: '注册成功',
                        userId: this.lastID,
                        token: token
                    });
                }
            );
        });
    } catch (error) {
        res.status(500).json({ error: '服务器错误' });
    }
});

// 登录
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: '用户名和密码不能为空' });
        }

        db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
            if (err) {
                return res.status(500).json({ error: '数据库错误' });
            }
            if (!user) {
                return res.status(401).json({ error: '用户名或密码错误' });
            }

            // 验证密码
            if (!bcrypt.compareSync(password, user.password)) {
                return res.status(401).json({ error: '用户名或密码错误' });
            }

            // 更新最后登录时间
            db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

            // 生成JWT token
            const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });

            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000
            });

            res.json({
                message: '登录成功',
                userId: user.id,
                username: user.username,
                studentName: user.student_name,
                className: user.class_name,
                token: token
            });
        });
    } catch (error) {
        res.status(500).json({ error: '服务器错误' });
    }
});

// 登出
app.post('/api/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: '已登出' });
});

// 获取用户信息
app.get('/api/me', authenticateToken, (req, res) => {
    db.get('SELECT id, username, student_name, class_name, created_at FROM users WHERE id = ?', [req.userId], (err, user) => {
        if (err) {
            return res.status(500).json({ error: '数据库错误' });
        }
        if (!user) {
            return res.status(404).json({ error: '用户不存在' });
        }
        res.json(user);
    });
});

// 保存进度
app.post('/api/progress', authenticateToken, (req, res) => {
    const { weekNum, moduleId, progressPercent } = req.body;

    db.run(
        `INSERT INTO progress (user_id, week_num, module_id, progress_percent)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(user_id, week_num, module_id)
         DO UPDATE SET progress_percent = ?, last_updated = CURRENT_TIMESTAMP`,
        [req.userId, weekNum, moduleId, progressPercent, progressPercent],
        function(err) {
            if (err) {
                return res.status(500).json({ error: '保存失败' });
            }
            res.json({ message: '进度已保存', id: this.lastID });
        }
    );
});

// 获取进度
app.get('/api/progress', authenticateToken, (req, res) => {
    const { weekNum } = req.query;

    let query = 'SELECT * FROM progress WHERE user_id = ?';
    const params = [req.userId];

    if (weekNum) {
        query += ' AND week_num = ?';
        params.push(weekNum);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: '数据库错误' });
        }
        res.json(rows);
    });
});

// 保存测验成绩
app.post('/api/quiz', authenticateToken, (req, res) => {
    const { quizId, score, totalQuestions, wrongAnswers, weekNum } = req.body;

    db.run(
        `INSERT INTO quiz_scores (user_id, quiz_id, score, total_questions, wrong_answers, week_num)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [req.userId, quizId, score, totalQuestions, JSON.stringify(wrongAnswers || []), weekNum],
        function(err) {
            if (err) {
                return res.status(500).json({ error: '保存失败' });
            }

            // 如果是周测验且及格，解锁下周
            if (weekNum && score / totalQuestions >= 0.6) {
                // 这里可以添加解锁逻辑
                res.json({
                    message: '成绩已保存',
                    id: this.lastID,
                    unlocked: true
                });
            } else {
                res.json({ message: '成绩已保存', id: this.lastID, unlocked: false });
            }
        }
    );
});

// 获取测验成绩
app.get('/api/quiz', authenticateToken, (req, res) => {
    const { weekNum } = req.query;

    let query = 'SELECT * FROM quiz_scores WHERE user_id = ?';
    const params = [req.userId];

    if (weekNum) {
        query += ' AND week_num = ?';
        params.push(weekNum);
    }

    query += ' ORDER BY completed_at DESC';

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: '数据库错误' });
        }

        // 解析 wrong_answers
        const results = rows.map(row => ({
            ...row,
            wrong_answers: JSON.parse(row.wrong_answers || '[]')
        }));

        res.json(results);
    });
});

// 记录页面访问
app.post('/api/visit', authenticateToken, (req, res) => {
    const { pageId } = req.body;

    db.run(
        'INSERT INTO visits (user_id, page_id) VALUES (?, ?)',
        [req.userId, pageId],
        function(err) {
            if (err) {
                return res.status(500).json({ error: '记录失败' });
            }
            res.json({ message: '已记录' });
        }
    );
});

// 导出数据
app.get('/api/export', authenticateToken, (req, res) => {
    db.all(`
        SELECT
            u.username,
            u.student_name,
            u.class_name,
            qs.quiz_id,
            qs.score,
            qs.total_questions,
            qs.week_num,
            qs.completed_at
        FROM quiz_scores qs
        JOIN users u ON qs.user_id = u.id
        WHERE u.id = ?
        ORDER BY qs.completed_at DESC
    `, [req.userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: '导出失败' });
        }

        const csv = [
            ['用户名', '姓名', '班级', '测验ID', '得分', '总分', '周数', '完成时间'].join(','),
            ...rows.map(r => [r.username, r.student_name, r.class_name, r.quiz_id, r.score, r.total_questions, r.week_num, r.completed_at].join(','))
        ].join('\n');

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename=study_data.csv');
        res.send('\uFEFF' + csv); // BOM for Excel
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`NOAI 学习平台后端服务已启动`);
    console.log(`服务地址: http://localhost:${PORT}`);
    console.log(`API文档: http://localhost:${PORT}/api`);
});

module.exports = app;
