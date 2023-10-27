const mongoose = require('mongoose');

const Post = new mongoose.Schema({
    title: {
        type: String,
        default: '',
        required: true
    },
    url: {
        type: String,
        default: ''
    },
    visibility: {
        type: String
    },
    publish: {
        type: Date,
        default: () => Date.now()
    },
    template: {
        type: String
    },

    content: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PageBuilder'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = Post;