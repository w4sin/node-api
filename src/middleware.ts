import { rateLimit } from 'express-rate-limit';

//limit for not-found routes
export const notfoundLimit = rateLimit({
    windowMs: 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: 'Too many requests, please try again later.',
})