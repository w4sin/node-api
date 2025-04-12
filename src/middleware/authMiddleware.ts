import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';

export const verifyToken = (req: Request) => {
    const token = req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
        ?
        req.headers['authorization']?.split(' ')[1] : undefined;
    if (!token)
        return { error: 'No token provided' }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "", { algorithms: ['HS256'] }) as JwtPayload;
        return { ...decoded, token } as JwtPayload;
    } catch (error) {
        return { error: 'Failed to authenticate' };
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const user = verifyToken(req);
    if (user.error)
        res.status(401).json({ error: user.error });
    else {
        req.body.user = user;
        next();
    }
}

export const adminAuthenticate = async (req: Request, res: Response, next: NextFunction) => {
    const user = verifyToken(req);
    if (user.error)
        res.status(401).json({ error: user.error });
    else if (user.role !== 'admin')
        res.status(403).json({ error: "You are not authorized" });
    else {
        req.body.user = user;
        next();
    }
}