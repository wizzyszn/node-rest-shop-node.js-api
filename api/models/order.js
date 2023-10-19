const mongoose = require('mongoose');
const {Schema} = mongoose
const orderSchema = new Schema({
    _id : {
        type : mongoose.Schema.Types.ObjectId
    },
        product : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Product',
            required : true
        },
        quantity :{
            type : Number,
            default : 1 
        }
    }


)

module.exports = mongoose.model('Order' , orderSchema)
    