const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const mongoose = require('mongoose');

const User = require('../../models/User');
const Event = require('../../models/event');


// GET	/user	===> Show all users 
router.get('/', async (req,res,next) => {
  try {
    const users = await User.find();
    // const users = await User.find({isAdmin: false});
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

    const user = await User.findById( id )
      .populate('savedJobs savedEvents');

    res.status(200).json(user);
  } 
  catch (error) {
    next(error);
  }
})


// PUT	/user/edit/:id	===> 
// {firstName,lastName,phone,profilePicture,currentCity,currentRole,linkedinUrl,githubUrl,mediumUrl}	
router.put('/edit/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phone, profilePicture, currentCity, currentRole, currentCompany, linkedinUrl, githubUrl, mediumUrl, isAdmin } = req.body;
    
    // console.log('PARAM ID', id);
    // console.log('CURRENT USER ID', req.session.currentUser._id);

    // check if the user being edited corresponds to the user logged in
    if ( id !== req.session.currentUser._id ) {
      res.status(401).json({ message: 'Unauthorized id'}); 
      return;
    }

    // Check that all required fields are completed
    if (!firstName || !lastName) {
      next(createError(400));
    } else {
      await User.findByIdAndUpdate(
        id, 
        {  firstName, lastName, phone, profilePicture, currentCity, currentRole, currentCompany, linkedinUrl, githubUrl, mediumUrl, isAdmin }, 
        { new: true }
      );
  
      const updatedUser = await User.findById(id);
      // console.log('UPDATED USER', updatedUser);
      req.session.currentUser = updatedUser;
      res.status(200).json(updatedUser);
    }
  } 
  catch (error) {
    next(error);
  }
})


// PUT	/user/:id/save-job/:jobId	===> save job offer in alumni dashboard
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


// PUT	/user/:id/save-event/:eventId	===> save event in alumni dashboard
router.put('/:id/save-event/:eventId', async(req, res, next) => {
  try {
    const { id, eventId } = req.params;
    // console.log('PARAMS', id, eventId);
    
    const updatedUser = await User.findByIdAndUpdate(
      id, 
      { $addToSet: {savedEvents: eventId} }, 
      { new: true }
    )

    await Event.findByIdAndUpdate(
      eventId, 
      { $addToSet: {attendingAlumni: id} }, 
      { new: true }
    )

    req.session.currentUser = updatedUser;
    res.status(200).json(updatedUser);
  }
  catch (error) {
    next(error);
  }
})


// PUT	/user/:id/remove-job/:jobId	===> remove job offer from alumni dashboard
router.put('/:id/remove-job/:jobId', async(req, res, next) => {
  try {
    const { id, jobId } = req.params;
    // console.log('PARAMS', id, jobId);
    
    const updatedUser = await User.findByIdAndUpdate(
      id, 
      { $pull: {savedJobs: jobId} }, 
      { new: true }
    ).populate('savedEvents');

    req.session.currentUser = updatedUser;
    res.status(200).json(updatedUser);
  }
  catch (error) {
    next(error);
  }
})


// PUT	/user/:id/remove-event/:eventId	===> remove event from alumni dashboard
router.put('/:id/remove-event/:eventId', async(req, res, next) => {
  try {
    const { id, eventId } = req.params;
    // console.log('PARAMS', id, eventId);
    
    const updatedUser = await User.findByIdAndUpdate(
      id, 
      { $pull: {savedEvents: eventId} }, 
      { new: true }
    ).populate('savedEvents');

    Event.findByIdAndUpdate(
      eventId, 
      { $pull: {attendingAlumni: id} }, 
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