const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const salt = await bcrypt.genSalt(10)
router.post('/signup', async (req,res,next)=>{
    const user = new User({
        _id : new mongoose.Types.ObjectId(),
        email : req.body.email,
        password : await bcrypt.hash(req.body.password, salt)
    })


})





module.exports = router;    