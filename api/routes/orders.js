const express = require('express');
const router = express.Router();
const mongooose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/products')
router.get('/', async (req,res,next)=>{
    try{
        const results = await Order.find().select('product _id quantity').populate('product', 'name')
        const response = {
            count : results.length,
            orders : results.map((result)=>{
                return{
                    id : result._id,
                    product : result.product,
                    quantity : result.quantity,
                    type : 'GET',
                    url : `http://localhost:3000/orders` + result._id

                }
            })
        }
         
        if(!results){
            res.status(400).json({
                message: "No Document found provide a valid Id"
            }
            )
        }res.status(200).json({
            order: response
        })
        
    }catch(error){
        res.status(500).json({ 
            error : error
        })
    }
})
router.post('/',async (req,res,next)=> {
        const checkId = await Product.findById(req.body.productId);
        if(checkId){
            const order = new Order({
                _id : new mongooose.Types.ObjectId(),
                quantity: req.body.quantity,
                product : req.body.productId
            })
           const result = await order.save()   
        res.status(201).json({ 
            message : 'Order Stored',
            createdOrder :{
                id : result._id,
                product : result.product,
                quantity : result.quantity
            },
            request :{
                type :'GET',
                url : 'http://localhost:3000/'+ result._id
            }
        })
        }

    else{
        res.status(500).json({
            message : 'Product not found'
        })
    }

})

router.get('/:orderId',async (req,res,next)=>{
    try{
        const order  = await Order.findById(req.params.orderId).populate('product')
        if(!order){
            return res.status(500).json({
                message : "product not found"
            })
        }
        res.status(200).json({
            order : order,
            request:{
                type : "GET",
                url : "http://localhost:3000/orders" + req.params.orderId


            }
        })
    }catch(err){
        res.status(500).json({
            error : err.message
        })
    }

})

router.delete('/:orderId', async (req,res,next)=>{
    try{
        const order = await Order.findByIdAndDelete(req.params.orderId);
        if(!order){
            return res.status(404).json({
                message : 'order not found'
            })
        }
        res.status(200).json({
            message : "Order deleted",
            request:{
                type : "POST",
                url : "http://localhost:3000/orders",
                body:{
                    productId : "ID",
                    quantity : "number"
                }
            }
        })

    }catch(err){
        res.status(500).json({
            error: err
        })

    }
    
})


module.exports = router;