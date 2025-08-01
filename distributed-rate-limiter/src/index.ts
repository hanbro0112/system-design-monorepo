import express from 'express';
import config from './config';
import redis from './redis';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send('Distributed Rate Limiter Server is running');
});

app.get('/test', async (req, res) => {
    redis.set('test', 'test', (err, result) => {
        if (err) {
            console.error('Error setting test key in Redis:', err);
            return res.status(500).send('Error setting test key in Redis');
        }
        console.log('Test key set successfully:', result);
    });
    res.status(200).send("Redis is connected and working!");
})
// // { api, user } 限流接口
// app.post('/', rateLimiter, (req, res) => res.status(200).send('OK'));

// // 返回 api 列表
// app.get('/api', );
// // 新增限流 api
// app.post('/api', );
// // 修改限流规则
// app.put('/api', );
// // 删除限流 api
// app.delete('/api', );

// // 獲取 api 限流狀態
// app.get('/status/api', );
// // 獲取使用者限流狀態
// app.get('/status/user', );


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Distributed-Rate-Limiter Server is running on http://localhost:${PORT}`);
});
