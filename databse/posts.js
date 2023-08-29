const mongoose = require('mongoose')
const Schema =mongoose.Schema;

const Post = new Schema({
    title:{
        type: String
    },
    status:{
        type: String
    },
    visibility:{
        type: String
    },
    public: {
        type: String
    }
})

module.exports = mongoose.model('post',Post)
