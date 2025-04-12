import { IUser } from "../models/user";

export type TResponse = {
    message?: string;
    error?: string;
}

export type LoginResponse = {
    token: string;
    user: Omit<IUser, 'password' | 'createdAt'>;
} & ResponseType