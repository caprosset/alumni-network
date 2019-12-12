const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const mongoose = require('mongoose');

const User = require('../../models/user');

// HELPER FUNCTIONS
const { validationSignup} = require('../../helpers/middlewares');


// GET	/user	===> Show all users 
router.get('/', async (req,res,next) => {
  try {
    const users = await User.find({isAdmin: false});
    // console.log(users);

    if(!users) {
      next(createError(404));
    } else {
      res.status(200).json(users);
      // // return only users that are not admin
      users.map( oneUser => {
        if(!oneUser.isAdmin) {
          return res.json(oneUser);
        }
      })
    }
  } catch (error) {
    next(error);
  }
})


// GET	/user/:id ===> Show specific user
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if ( !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Specified id is not valid'}); 
      return;
    }

    const user = await User.findById( id );
    res.status(200).json(user);
  } 
  catch (error) {
    next(error);
  }
})


// PUT	/user/edit/:id	===> 
// {firstName,lastName,phone,profilePicture,currentCity,currentRole,linkedinUrl,githubUrl,mediumUrl}	
// Check that all fields required are completed (validationSignup)
router.put('/edit/:id', validationSignup, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, password, bootcamp, campus, cohort, phone, profilePicture, currentCity, currentRole, linkedinUrl, githubUrl, mediumUrl, isAdmin } = req.body;
    
    // console.log('PARAM ID', id);
    // console.log('CURRENT USER ID', req.session.currentUser._id);

    // check if the user being edited corresponds to the user logged in
    if ( id !== req.session.currentUser._id ) {
      res.status(401).json({ message: 'Unauthorized id'}); 
      return;
    }

    await User.findByIdAndUpdate(
      id, 
      {  firstName, lastName, email, password, bootcamp, campus, cohort, phone, profilePicture, currentCity, currentRole, linkedinUrl, githubUrl, mediumUrl, isAdmin }, 
      { new: true }
    );

    const updatedUser = await User.findById(id);
    // console.log('UPDATED USER', updatedUser);
    req.session.currentUser = updatedUser;
    res.status(200).json(updatedUser);
  } 
  catch (error) {
    next(error);
  }
})


// PUT	/user/:id/save-job/:jobId	===> save job offer in alumni profile
router.put('/:id/save-job/:jobId', async(req, res, next) => {
  try {
    const { id, jobId } = req.params;
    // console.log('PARAMS', id, jobId);
    
    const updatedUser = await User.findByIdAndUpdate(
      id, 
      { $addToSet: {savedJobs: jobId} }, 
      { new: true }
    )

    req.session.currentUser = updatedUser;
    res.status(200).json(updatedUser);
  }
  catch (error) {
    next(error);
  }
})


// PUT	/user/:id/save-event/:eventId	===> save event in alumni profile
router.put('/:id/save-event/:eventId', async(req, res, next) => {
  try {
    const { id, eventId } = req.params;
    // console.log('PARAMS', id, eventId);
    
    const updatedUser = await User.findByIdAndUpdate(
      id, 
      { $addToSet: {savedEvents: eventId} }, 
      { new: true }
    )

    req.session.currentUser = updatedUser;
    res.status(200).json(updatedUser);
  }
  catch (error) {
    next(error);
  }
})


// DELETE	/user'/delete/:id' ===>	delete specific alumni (status codes:  201,400)
// alumni can't delete their profile for now

module.exports = router;