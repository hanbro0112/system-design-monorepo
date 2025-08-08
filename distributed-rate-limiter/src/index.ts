import express from 'express';
import cors from 'cors';
import config from './config';
import controller from './rate-limiter'

const app = express();
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.status(200).send('Distributed Rate Limiter Server is running');
});

app.get('/rate-limiter', async (req, res) => {
    const result = await controller.getRateLimiterList();
    res.status(200).send(result);
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


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Distributed-Rate-Limiter Server is running on http://localhost:${PORT}`);
});
