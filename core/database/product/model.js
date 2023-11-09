const mongoose = require('mongoose')

const Product = new mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    media: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'media'
    },
    status: {
        type: String
    },
    visibility: {
        type: String
    },
    simpleProductType:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'simple'
    },
    variableProductType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'variable'
    }
})

module.exports = Product