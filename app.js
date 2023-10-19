const express = require('express');
const morgan = require('morgan');
//const cors = require('cors')
const mongoose = require('mongoose');
const bodyParser = express.urlencoded({extended : true})
const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')
const userRoutes = require('./api/routes/user')
require('dotenv').config()
const app = express()
mongoose.connect(process.env.MONGODB_URI).then(()=>
console.log('connected to dB')
).catch((error) =>{
    console.log(error)

})
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers',"Origin, X-Requested-With, Content-Type , Accept, Authorization");
if(req.method === "OPTIONS"){
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({})
}
next()
})
app.use(bodyParser)
app.use(express.json())
app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))
app.use('/products',productRoutes);
app.use('/orders', orderRoutes); 
app.use('/user' , userRoutes)
app.use((req,res,next)=>{
    const error = new  Error('Not Found');
    error.status = 404
    next(error)

})
app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error :{
            message : error.message
        }
    })
    
})
module.exports = app