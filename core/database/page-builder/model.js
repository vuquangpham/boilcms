const mongoose = require('mongoose');

const PageBuilder = new mongoose.Schema({
    content: {
        type: String,
        default: '',
        required: true
    }
});

module.exports = mongoose.model('PageBuilder', PageBuilder);