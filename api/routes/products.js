const express = require('express')
const router = express.Router()
const Product = require('../models/products')
const mongoose = require('mongoose')
const multer = require('multer')
const fs = require('fs')
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads/')
  console.log(process.cwd())
}
//create file storage engine
const storageEngine = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      './uploads/'
    )
  },
  filename : function(req,file,cb){
    cb(null, file.originalname)

  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(null, false) 
  }
}
const upload = multer({
  storage: storageEngine,
  limits: {
    fileSize: 1024 * 1024 * 5 //5 megebytes
  },
  fileFilter: fileFilter
})
//get for products All
router.get('/', async (req, res, next) => {
  try {
    const docs = await Product.find().select('name _id price productImage')
    const response = {
      count: docs.length,
      products: docs.map(doc => {
        return {
          name: doc.name,
          price: doc.price,
          id: doc._id,
          productImage : doc.productImage,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/products/' + doc._id
          }
        }
      })
    }
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({
      error: error
    })
  }
})
// Post for products
router.post('/', upload.single('productImage'), async (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage : req.file.path
  })
  //save the document
  try {
    const result = await product.save()
    const response = {
      name: result.name,
      price: result.price,
      _id: result._id,
      productImage : result.productImage,
      request: {
        type: 'GET',
        url: 'http://localhost:3000' + result._id
      }
    }
    res.status(200).json({
      message: 'Created a Product Successfully',
      createdProduct: response
    })
  } catch (error) {
    res.status(400).json({
      error: error
    })
  }
})
//get for Each Product Id
router.get('/:productId', async (req, res, next) => {
  try {
    const id = req.params.productId
    const result = await Product.findById(id).select('name price _id productImage')
    const response = {
      name: result.name,
      price: result.price,
      id: id,
      request: {
        type: 'GET',
        url: 'http://localhost:3000/products/' + id
      }
    }
    console.log(result)
    if (!result) {
      return res.status(400).json({
        document: 'documnet does not exist'
      })
    }
    res.status(200).json({
      document: response
    })
  } catch (error) {
    console.log(error)
    res.status(404).json({
      error: error.message
    })
  }
})
//patch for Each Product Id
router.patch('/:productId', async (req, res, next) => {
  try {
    const id = req.params.productId
    const updatedOps = {}
    for (const ops of req.body) {
      updatedOps[ops.propName] = ops.value
    }
    const result = await Product.updateOne({ _id: id }, { $set: updatedOps })
    const response = {
      message: 'Product Updated',
      request: {
        type: 'GET',
        url: 'http://localhost:3000/products' + id
      }
    }
    res.status(200).json(response)
  } catch (error) {
    res.status(404).json({
      error: error
    })
  }
})
//Delete for Each Product Id
router.delete('/:productId', async (req, res, next) => {
  try {
    const id = req.params.productId
    const document = await Product.findOneAndDelete({ _id: id })
    const response = {
      message: 'Product deleted',
      request: {
        type: 'POST',
        url: 'http://localhost:3000/products',
        body: {
          name: 'String',
          price: 'Number'
        }
      }
    }
    if (!document) {
      return res.status(200).json({ message: 'The Document does not exist' })
    }
    res.status(200).json({
      document: response
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: error
    })
  }
})
module.exports = router
