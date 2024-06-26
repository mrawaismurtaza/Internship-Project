import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import connection from "./db.mjs"; // Import the connection file
import User from "./Model/UserModel.mjs"; // Import the user model

dotenv.config();

const app = express();
const port = 4002;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
connection();

app.post("/signup", async (req, res) => {
    const { email, password, username } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.json({ registered: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "User is not registered" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Password is incorrect" });
        }

        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET || "defaultsecret");
        res.cookie("token", token, { httpOnly: true, secure: true });
        return res.json({ login: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
