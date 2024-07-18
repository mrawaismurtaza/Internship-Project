import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    media: {
        imageUrl: {
            type: String,
            required: false
        },
        videoUrl: {
            type: String,
            required: false
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Post = mongoose.model("Post", postSchema);

export default Post;
