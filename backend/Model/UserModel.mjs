import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    followers: {
        type: [mongoose.Schema.Types.ObjectId],  // Array of ObjectId
        ref: 'User',
        default: []  // Initialize as an empty array
    },
    following: {
        type: [mongoose.Schema.Types.ObjectId],  // Array of ObjectId
        ref: 'User',
        default: []  // Initialize as an empty array
    }
});

const User = mongoose.model("User", userSchema);

export default User;
