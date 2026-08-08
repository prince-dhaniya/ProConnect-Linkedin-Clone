import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import dns from "dns";
import postRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/users.routes.js";

dns.setDefaultResultOrder("ipv4first");


dotenv.config({ path: "../.env" });

const app = express();

app.use(cors());
app.use(express.json());
app.use(postRoutes);
app.use(userRoutes);
app.use(express.static("uploads"))

const start = async () => {
    try {
        const mongoUri = process.env.MONGO_URL || "mongodb+srv://Linkedin_Clone:linkedinclone@linkedinclone.2mvrpac.mongodb.net/?appName=linkedinclone";
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
            family: 4 // Force IPv4
        });
        console.log("MongoDB connected successfully");

        app.listen(9090, () => {
            console.log("server is running at port 9090");
        });
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        process.exit(1);
    }
};

start();