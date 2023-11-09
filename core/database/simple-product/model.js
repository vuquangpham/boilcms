const mongoose = require('mongoose')

const Simple = new mongoose.Schema({
    price: {
        type: Number
    },
    salesPrice: {
        type: Number
    },
    inventory: {
        type: Number
    },
    attribute:{}
})

// have string from input: " size: Small | Medium | Large " then use

// const ex1 = splitString('size: Small | Medium | Large', ':')
// const ex2 = splitString(ex1[1], '|')
//
// product.attributes[ex1[0]] = ex2;
//
// await product.save();

//  => attribute: {
//     size: ['Small', 'Medium', 'Large']
// }

module.exports = Simple