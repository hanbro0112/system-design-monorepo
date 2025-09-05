import express from 'express';
import cors from 'cors';


const app = express();
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.status(200).send('Consistent-Hashing is running');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Consistent-Hashing Server is running on http://localhost:${PORT}`);
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