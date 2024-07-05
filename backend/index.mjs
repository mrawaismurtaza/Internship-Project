import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import connection from './db.mjs'; // Import the connection file
import User from './Model/UserModel.mjs'; // Import the user model

dotenv.config();

const app = express();
const port = 4002;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
connection();

app.post('/signup', async (req, res) => {
    const { email, password, username } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            followers: [],
            following: []
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

        const token = jwt.sign({ email: user.email, userId: user._id }, process.env.JWT_SECRET || "defaultsecret", { expiresIn: '1h' });
        res.cookie("token", token, { httpOnly: true, secure: true });
        return res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fetch the follower count for a user
app.get('/users/:userId/followers', async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId).populate('followers');
        if (!user) return res.status(404).json({ error: 'User not found' });

        const followersCount = user.followers.length;
        res.json({ count: followersCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fetch the following count for a user
app.get('/users/:userId/following', async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId).populate('following');
        if (!user) return res.status(404).json({ error: 'User not found' });

        const followingCount = user.following.length;
        res.json({ count: followingCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Follow a user
app.post('/users/:userId/follow', async (req, res) => {
    const { userId } = req.params;

    try {
        const currentUser = await User.findById(req.userId);
        const userToFollow = await User.findById(userId);

        if (!currentUser || !userToFollow) return res.status(404).json({ error: 'User not found' });

        if (currentUser.following.includes(userId)) {
            return res.status(400).json({ error: 'Already following this user' });
        }

        currentUser.following.push(userId);
        userToFollow.followers.push(req.userId);

        await currentUser.save();
        await userToFollow.save();

        res.json({ message: 'Successfully followed the user' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Unfollow a user
app.post('/users/:userId/unfollow', async (req, res) => {
    const { userId } = req.params;

    try {
        const currentUser = await User.findById(req.userId);
        const userToUnfollow = await User.findById(userId);

        if (!currentUser || !userToUnfollow) return res.status(404).json({ error: 'User not found' });

        if (!currentUser.following.includes(userId)) {
            return res.status(400).json({ error: 'Not following this user' });
        }

        currentUser.following.pull(userId);
        userToUnfollow.followers.pull(req.userId);

        await currentUser.save();
        await userToUnfollow.save();

        res.json({ message: 'Successfully unfollowed the user' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fetch user profile data
app.get("/users/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('username');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log(user)
;        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
