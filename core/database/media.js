const mongoose = require('mongoose')
const Schema =mongoose.Schema;

const Media = new Schema({
    title:{
        type: String
    },
})

module.exports = mongoose.model('media',Media)
