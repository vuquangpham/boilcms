const mongoose = require('mongoose');

const Post = new mongoose.Schema({
    post_id: {
        type: String
    },
    title: {
        type: String
    },
    status: {
        type: String
    },
    visibility: {
        type: String
    },
    publish: {
        type: Date
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    url: {
        type: String
    }
});

module.exports = Post;