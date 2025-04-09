import express, { Application, Request, Response } from 'express';

import { notfoundLimit } from './middleware';

import authRouter from './route/auth';
import { connectDB } from './mongoDB';

const app: Application = express();
const PORT: string = process.env.PORT || "3000";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB().then(() => {
    app.use('/auth', authRouter);

    app.all('/*', notfoundLimit, (req: Request, res: Response) => {
        res.status(404).send('Route not found!');
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});