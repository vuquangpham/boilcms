const mongoose = require('mongoose');

const PageBuilder = new mongoose.Schema({
    pageId: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        default: '',
        required: true
    }
});

module.exports = PageBuilder;