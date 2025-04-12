import mongoose, { Model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { LoginResponse, TResponse } from "../types/response";
import jwt from "jsonwebtoken";

const saltRounds = 10;

export interface IUser {
    username: string;
    password: string;
    role: string;
    createdAt: Date;
}

interface UserModel extends Model<IUser> {
    register(username: string, password: string, role?: string): Promise<TResponse>;
    login(username: string, password: string): Promise<LoginResponse>;
}

const userSchema = new Schema<IUser, UserModel>({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

userSchema.static('register', async function (username: string, password: string, role?: string) {
    // Check if user already exists
    const existingUser = await this.findOne({ username });
    if (existingUser) return { error: "User already exists" };

    try {
        // Create a new user instance
        // and save it to the database
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({ username, password: hashedPassword, role: role || "user" });
        await newUser.save();

        return { message: "User registered successfully" };
    } catch (error) {
        console.error("Error registering user:", error);
        return { error: "Error registering user" };
    }
})

userSchema.static('login', async function (username: string, password: string) {
    const existingUser = await this.findOne({ username });
    if (!existingUser) return { error: "User not found" };
    try {
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) return { error: "Invalid password" };
        
        const token = jwt.sign(
            { username: existingUser.username, role: existingUser.role },
            process.env.JWT_SECRET || "",
            { expiresIn: '1h', algorithm: 'HS256' }
        );
        return { token, message: "Login successful", user: { username: existingUser.username, role: existingUser.role } };
    } catch (error) {
        console.error("Error logging in:", error);
        return { error: "Error logging in" };
    }
})

const User: UserModel = mongoose.model<IUser, UserModel>('User', userSchema);

export default User;