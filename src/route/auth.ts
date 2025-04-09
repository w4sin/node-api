import express, { Request, Response } from 'express';
const router = express.Router();

router.get('/login', (req: Request, res: Response) => {
    res.send('login route is working!');
});

export default router;