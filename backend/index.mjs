import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import connection from "./db.mjs";
import User from "./Model/UserModel.mjs";
import Post from "./Model/PostModel.mjs";

dotenv.config();

const app = express();
const port = 4002;

app.use(express.json());
app.use(cors());

connection();

app.post("/signup", async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      followers: [],
      following: [],
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

    const token = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "2m" }
    );
    res.cookie("token", token, { httpOnly: true, secure: true });
    return res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/users/:userId/followers", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate("followers");
    if (!user) return res.status(404).json({ error: "User not found" });

    const followersCount = user.followers.length;
    res.json({ count: followersCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/users/:userId/following", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate("following");
    if (!user) return res.status(404).json({ error: "User not found" });

    const followingCount = user.following.length;
    res.json({ count: followingCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("username");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(user);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/users/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const currentUser = await User.findById(userId).populate("followers").populate("following");
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const users = await User.find();
        if (!users.length) {
            return res.status(404).json({ message: "No users found" });
        }

        const booleanArray = users.map((user) => 
            currentUser.following.some((following) => following._id.equals(user._id))
        );

        res.json({ users, booleanArray });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



app.post("/follow/:user", async (req, res) => {
    const userIdToFollow = req.params.user; 
    const { userId } = req.body;        

    try {
        const userToFollow = await User.findById(userIdToFollow);
        const currentUser = await User.findById(userId);

        if (!userToFollow) return res.status(404).json({ error: "User to follow not found" });
        if (!currentUser) return res.status(404).json({ error: "Current user not found" });

        if (currentUser.following.includes(userToFollow._id)) {
            return res.status(400).json({ error: "Already following this user" });
        }

        currentUser.following.push(userToFollow._id);
        userToFollow.followers.push(currentUser._id);

        await currentUser.save();
        await userToFollow.save();

        res.status(200).json({ message: "Followed successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.post("/unfollow/:user", async (req, res) => {
    const userIdToUnfollow = req.params.user;
    const { userId } = req.body;

    try {
        const userToUnfollow = await User.findById(userIdToUnfollow);
        const currentUser = await User.findById(userId);

        if (!userToUnfollow || !currentUser) {
            return res.status(404).json({ error: "User not found" });
        }

        if (currentUser.following.includes(userIdToUnfollow)) {
            currentUser.following = currentUser.following.filter(id => id.toString() !== userIdToUnfollow);
            userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== userId);

            await currentUser.save();
            await userToUnfollow.save();

            return res.status(200).json({ message: "Unfollowed successfully" });
        } else {
            return res.status(400).json({ error: "Already unfollowed this user" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});



//Post Apis

app.post("/createpost/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { description, imageUrl, videoUrl } = req.body;

    const newPost = new Post({
      user: userId,
      description,
      media: {
        imageUrl,
        videoUrl,
      },
      likes: [], // Initialize likes as an empty array
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/posts/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ user: { $ne: userId } }).populate("user", "username");
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

app.get("/posts/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ user: { $ne: userId } }).populate("user", "username"); // Exclude posts by userId and populate user field with username from User model
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});


app.post("/posts/:postId/like/:userId", async (req, res) => {
  try {
    const { postId, userId } = req.params;
    
    // Find the post
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user has already liked the post
    const userIndex = post.likes.indexOf(userId);
    if (userIndex === -1) {
      // User has not liked the post, add the userId to the likes array
      post.likes.push(userId);
    } else {
      // User has already liked the post, remove the userId from the likes array
      post.likes.splice(userIndex, 1);
    }

    await post.save();

    res.status(200).json({ likes: post.likes.length });
  } catch (error) {
    console.error("Error liking the post:", error);
    res.status(500).json({ error: "Failed to like the post" });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
