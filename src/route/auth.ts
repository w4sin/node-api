import express, { Request, Response } from 'express';
import User from '../models/user';
import { adminAuthenticate, authenticate, verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/me', authenticate, async (req: Request, res: Response) => {
    const { user } = req.body;
    res.json(user);
});

router.post('/register', async (req: Request, res: Response) => {
    const { username, password, role } = req.body;
    try {
        if (!username || !password)
            res.status(400).json({ error: "Username and password are required." });
        if (role) {
            const user = verifyToken(req);
            if (!user || user.error || user.role !== 'admin')
                res.status(403).json({ error: user.error || "You are not authorized" });
            else
                res.json(await User.register(username, password, role));
        } else
            res.json(await User.register(username, password));
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error creating user." });
    }
})

router.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        if (!username || !password)
            res.status(400).json({ error: "Username and password are required." });
        else
            res.json(await User.login(username, password));
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error logging in." });
    }
})

router.delete('/delete', adminAuthenticate, async (req: Request, res: Response) => {
    const { username } = req.body;
    if (!username) {
        res.status(400).json({ error: "Username is required." });
        return
    }
    await User.deleteOne({ username }).then((result) => {
        if (result.deletedCount === 0)
            res.status(404).json({ error: "User not found." });
        else
            res.json({ message: "User deleted successfully." });
    }).catch((error) => {
        console.log(error);
        res.status(500).json({ error: "Error deleting user." });
    })
})

export default router;