import express from 'express';
import cors from 'cors';
import controller from './rate-limiter'

const app = express();
app.use(cors());
app.use(express.json());


app.get('/rate-limiter', async (req, res) => {
    const result = await controller.getRateLimiterList();
    res.status(200).send(result);
});

app.get('/rate-limiter/:key/:method', async (req, res) => {
    const { key, method } = req.params;
    const result = await controller.runRateLimiter(key, method);
    if (result) {
        res.status(200).send('Accepted!');
    } else {
        res.status(429).send('Rejected!');
    }
});

app.post('/rate-limiter/:key', async (req, res) => {
    const key = req.params.key;
    const { method, config } = req.body;
    const result = await controller.setRateLimiter(key, method, config);
    res.status(200).send(result);
});

app.delete('/rate-limiter/:key/:method', async (req, res) => {
    const { key, method } = req.params;
    const result = await controller.deleteRateLimiter(key, method);
    res.status(200).send(result);
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
    console.log(`Distributed-Rate-Limiter Server is running on http://localhost:${PORT}`);
});

// error handler
import { Request, Response, NextFunction } from 'express';

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = err;
    console.log(err.message);
    // render the error page
    res.status(err.status || 500);
    res.send('error');
});