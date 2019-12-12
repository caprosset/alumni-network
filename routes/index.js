const express = require('express');
const router = express.Router();

// ROUTER
const authRouter = require('./auth/auth');


// * '/auth' 
router.use('/auth', authRouter);



module.exports = router;