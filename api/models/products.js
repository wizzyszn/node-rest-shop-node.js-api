const mongoose = require('mongoose');
const {Schema} = mongoose
const productSchema = new Schema({
    _id : {
        type : mongoose.Schema.Types.ObjectId
    },
    name : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    productImage :{
        type : String,
        required : true
    }
}, {timestamps : true})
module.exports = mongoose.model('Product', productSchema)