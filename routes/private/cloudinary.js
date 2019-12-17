const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const parser = require('../../config/cloudinary');


router.post('/', parser.single('image'), (req,res,next)=> {  
  console.log("inside cloudinary upload route");
  const image_url = req.file.secure_url;
  res.status(201).json(image_url);
})

module.exports = router;