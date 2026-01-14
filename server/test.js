// NOAI 学习平台 - 后端测试
const assert = require('assert');
const fs = require('fs');
const path = require('path');

// 测试数据库文件路径
const TEST_DB = './test_students.db';

// 清理测试数据库
if (fs.existsSync(TEST_DB)) {
    fs.unlinkSync(TEST_DB);
}

// 设置测试环境变量
process.env.PORT = 3001;
process.env.JWT_SECRET = 'test-secret-key';

// 导入应用
const app = require('./index');
const request = require('supertest')(app);

// 辅助函数：等待
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 测试套件
async function runTests() {
    console.log('\n========================================');
    console.log('  NOAI 学习平台 - 后端测试');
    console.log('========================================\n');

    let testToken;
    let testUserId;

    // 测试1: 健康检查
    console.log('测试 1: 静态文件服务...');
    try {
        const res = await request.get('/');
        assert(res.status === 200 || res.status === 304, '首页应可访问');
        console.log('  ✓ 静态文件服务正常\n');
    } catch (err) {
        console.log('  ✗ 失败:', err.message, '\n');
    }

    // 测试2: 用户注册
    console.log('测试 2: 用户注册...');
    try {
        const res = await request.post('/api/register')
            .send({
                username: 'testuser',
                password: 'testpass123',
                studentName: '测试学生',
                className: '高一1班'
            });

        assert(res.status === 200, '注册应返回200');
        assert(res.body.userId, '应返回用户ID');
        assert(res.body.token, '应返回JWT token');

        testUserId = res.body.userId;
        testToken = res.body.token;
        console.log(`  ✓ 注册成功, 用户ID: ${testUserId}\n`);
    } catch (err) {
        console.log('  ✗ 失败:', err.message, '\n');
    }

    // 测试3: 重复注册应失败
    console.log('测试 3: 重复用户名注册应失败...');
    try {
        const res = await request.post('/api/register')
            .send({
                username: 'testuser',
                password: 'anotherpass'
            });

        assert(res.status === 409, '重复用户名应返回409');
        assert(res.body.error === '用户名已存在', '应返回正确错误信息');
        console.log('  ✓ 重复注册被正确拒绝\n');
    } catch (err) {
        console.log('  ✗ 失败:', err.message, '\n');
    }

    // 测试4: 用户登录
    console.log('测试 4: 用户登录...');
    try {
        const res = await request.post('/api/login')
            .send({
                username: 'testuser',
                password: 'testpass123'
            });

        assert(res.status === 200, '登录应返回200');
        assert(res.body.token, '应返回JWT token');
        assert(res.body.username === 'testuser', '应返回用户名');
        console.log('  ✓ 登录成功\n');
    } catch (err) {
        console.log('  ✗ 失败:', err.message, '\n');
    }

    // 测试5: 错误密码登录
    console.log('测试 5: 错误密码登录应失败...');
    try {
        const res = await request.post('/api/login')
            .send({
                username: 'testuser',
                password: 'wrongpassword'
            });

        assert(res.status === 401, '错误密码应返回401');
        console.log('  ✓ 错误密码被正确拒绝\n');
    } catch (err) {
        console.log('  ✗ 失败:', err.message, '\n');
    }

    // 测试6: 不存在用户登录
    console.log('测试 6: 不存在用户登录应失败...');
    try {
        const res = await request.post('/api/login')
            .send({
                username: 'nonexistent',
                password: 'testpass'
            });

        assert(res.status === 401, '不存在用户应返回401');
        console.log('  ✓ 不存在用户被正确拒绝\n');
    } catch (err) {
        console.log('  ✗ 失败:', err.message, '\n');
    }

    // 测试7: 无token访问受保护路由
    console.log('测试 7: 无token访问受保护路由应失败...');
    try {
        const res = await request.get('/api/me');
        assert(res.status === 401, '无token应返回401');
        console.log('  ✓ 无token访问被正确拒绝\n');
    } catch (err) {
        console.log('  ✗ 失败:', err.message, '\n');
    }

    // 测试8: 获取用户信息
    console.log('测试 8: 获取用户信息...');
    try {
        const res = await request.get('/api/me')
            .set('Cookie', `token=${testToken}`);

        assert(res.status === 200, '应返回200');
        assert(res.body.username === 'testuser', '应返回正确用户名');
        console.log('  ✓ 获取用户信息成功\n');
    } catch (err) {
        console.log('  ✗ 失败:', err.message, '\n');
    }

    // 测试9: 保存学习进度
    console.log('测试 9: 保存学习进度...');
    try {
        const res = await request.post('/api/progress')
            .set('Cookie', `token=${testToken}`)
            .send({
                weekNum: 1,
                moduleId: 'python-basics',
                progressPercent: 75
            });

        assert(res.status === 200, '保存进度应返回200');
        console.log('  ✓ 保存学习进度成功\n');
    } catch (err) {
        console.log('  ✗ 失败:', err.message, '\n');
    }

    // 测试10: 获取学习进度
    console.log('测试 10: 获取学习进度...');
    try {
        const res = await request.get('/api/progress')
            .set('Cookie', `token=${testToken}`)
            .query({ weekNum: 1 });

        assert(res.status === 200, '应返回200');
        assert(Array.isArray(res.body), '应返回数组');
        assert(res.body.length > 0, '应包含进度记录');
        console.log('  ✓ 获取学习进度成功\n');
    } catch (err) {
        console.log('  ✗ 失败:', err.message, '\n');
    }

    // 测试11: 保存测验成绩
    console.log('测试 11: 保存测验成绩...');
    try {
        const res = await request.post('/api/quiz')
            .set('Cookie', `token=${testToken}`)
            .send({
                quizId: 'week1',
                score: 18,
                totalQuestions: 25,
                wrongAnswers: [
                    { questionId: 5, yourAnswer: 1, correctAnswer: 2 },
                    { questionId: 12, yourAnswer: 0, correctAnswer: 3 }
                ],
                weekNum: 1
            });

        assert(res.status === 200, '保存成绩应返回200');
        assert(res.body.unlocked === true, '及格应解锁下周');
        console.log('  ✓ 保存测验成绩成功，已解锁下周\n');
    } catch (err) {
        console.log('  ✗ 失败:', err.message, '\n');
    }

    // 测试12: 获取测验成绩
    console.log('测试 12: 获取测验成绩...');
    try {
        const res = await request.get('/api/quiz')
            .set('Cookie', `token=${testToken}`)
            .query({ weekNum: 1 });

        assert(res.status === 200, '应返回200');
        assert(Array.isArray(res.body), '应返回数组');
        assert(res.body.length > 0, '应包含成绩记录');
        assert(res.body[0].score === 18, '应返回正确分数');
        console.log('  ✓ 获取测验成绩成功\n');
    } catch (err) {
        console.log('  ✗ 失败:', err.message, '\n');
    }

    // 测试13: 记录页面访问
    console.log('测试 13: 记录页面访问...');
    try {
        const res = await request.post('/api/visit')
            .set('Cookie', `token=${testToken}`)
            .send({ pageId: 'python-basics' });

        assert(res.status === 200, '记录访问应返回200');
        console.log('  ✓ 记录页面访问成功\n');
    } catch (err) {
        console.log('  ✗ 失败:', err.message, '\n');
    }

    // 测试14: 导出数据
    console.log('测试 14: 导出学习数据...');
    try {
        const res = await request.get('/api/export')
            .set('Cookie', `token=${testToken}`);

        assert(res.status === 200, '导出应返回200');
        assert(res.headers['content-type'].includes('csv'), '应返回CSV文件');
        console.log('  ✓ 导出学习数据成功\n');
    } catch (err) {
        console.log('  ✗ 失败:', err.message, '\n');
    }

    // 测试15: 登出
    console.log('测试 15: 用户登出...');
    try {
        const res = await request.post('/api/logout')
            .set('Cookie', `token=${testToken}`);

        assert(res.status === 200, '登出应返回200');
        console.log('  ✓ 登出成功\n');
    } catch (err) {
        console.log('  ✗ 失败:', err.message, '\n');
    }

    // 测试16: 验证参数校验
    console.log('测试 16: 注册参数校验...');
    try {
        const res = await request.post('/api/register')
            .send({ username: '', password: '' });

        assert(res.status === 400, '空参数应返回400');
        console.log('  ✓ 参数校验正常\n');
    } catch (err) {
        console.log('  ✗ 失败:', err.message, '\n');
    }

    // 测试17: 第二个用户注册测试
    console.log('测试 17: 多用户注册...');
    try {
        const res = await request.post('/api/register')
            .send({
                username: 'testuser2',
                password: 'testpass456',
                studentName: '测试学生2',
                className: '高一2班'
            });

        assert(res.status === 200, '第二个用户注册应成功');
        const user2Token = res.body.token;

        // 验证用户数据隔离
        const progressRes = await request.get('/api/progress')
            .set('Cookie', `token=${user2Token}`);

        assert(progressRes.body.length === 0, '新用户应无进度记录');
        console.log('  ✓ 多用户数据隔离正常\n');
    } catch (err) {
        console.log('  ✗ 失败:', err.message, '\n');
    }

    // 测试18: 不及格测验不应解锁
    console.log('测试 18: 不及格测验不应解锁下周...');
    try {
        const res = await request.post('/api/quiz')
            .set('Cookie', `token=${testToken}`)
            .send({
                quizId: 'week2',
                score: 10,
                totalQuestions: 25,
                weekNum: 2
            });

        assert(res.status === 200, '保存应成功');
        assert(res.body.unlocked === false, '不及格不应解锁');
        console.log('  ✓ 不及格不解锁逻辑正确\n');
    } catch (err) {
        console.log('  ✗ 失败:', err.message, '\n');
    }

    console.log('========================================');
    console.log('  测试完成！');
    console.log('========================================\n');

    // 清理测试数据库
    try {
        if (fs.existsSync(TEST_DB)) {
            fs.unlinkSync(TEST_DB);
        }
    } catch (err) {
        console.log('清理测试数据库失败:', err.message);
    }

    // 关闭服务器
    process.exit(0);
}

// 运行测试
runTests().catch(err => {
    console.error('测试运行失败:', err);
    process.exit(1);
});
