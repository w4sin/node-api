import express, { Application, Request, Response } from 'express';

import { notfoundLimit } from './middleware/rateLimitMiddleware';

import authRouter from './route/auth';
import { connectDB } from './db';

const app: Application = express();
const PORT: string = process.env.PORT || "3000";

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connectDB().then(() => {
    app.use('/auth', authRouter);

    app.all('/*', notfoundLimit, (req: Request, res: Response) => {
        res.status(404).send('Route not found!');
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});