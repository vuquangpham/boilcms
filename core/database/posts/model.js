const mongoose = require('mongoose');
const {stringToSlug} = require("../../utils/helper.utils");

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
    content: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PageBuilder'
    }
});

Post.methods.validateBeforeAdd = function(){
    this.url = stringToSlug(this.title);
};

module.exports = Post;