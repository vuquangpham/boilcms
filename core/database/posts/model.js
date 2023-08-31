const mongoose = require('mongoose');
const {stringToSlug} = require("../../utils/helpers");

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
    },
});

Post.methods.validateBeforeAdd = function(){
    this.url = stringToSlug(this.title);
};

module.exports = Post;