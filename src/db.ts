import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) throw new Error("MongoDB URI is not defined in environment variables");
        await mongoose.connect(mongoURI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed", error);
        process.exit(1);
    }
}