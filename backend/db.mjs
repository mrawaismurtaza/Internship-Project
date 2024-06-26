import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connection = async () => {
    try {
        await mongoose.connect(process.env.URL || "mongodb://localhost:27017/", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000 // 10 seconds timeout
        });
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
        process.exit(1);
    }
};

export default connection;
