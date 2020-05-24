const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const mongoose = require('mongoose');

const User = require('../../models/User');
const Event = require('../../models/Event');


// GET	/user	===> Show all users 
router.get('/', async (req,res,next) => {
  try {
    // return only users that are not admin
    const users = await User.find({isAdmin: false});
    res.status(200).json(users);
  } catch (error) {
    next(createError(error));
  }
})


// GET	/user/:id ===> Show specific user
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  
  try {
    if ( !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ "message": "Specified id is not valid"}); 
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
router.put('/edit/:id', async (req, res, next) => {
  const { id } = req.params;
  const { firstName, lastName, phone, image, currentCity, currentRole, currentCompany, linkedinUrl, githubUrl, mediumUrl } = req.body;
  
  try {
    // check if the user being edited corresponds to the user logged in
    if ( id !== req.session.currentUser._id ) {
      res.status(401).json({ "message": "Unauthorized id"}); 
      return;
    }

    // Check that all required fields are completed
    if (!firstName || !lastName) {
      next(createError(400));
    } else {
      const updatedUser = await User.findByIdAndUpdate(
        id, 
        {  firstName, lastName, phone, image, currentCity, currentRole, currentCompany, linkedinUrl, githubUrl, mediumUrl }, 
        { new: true }
      );
  
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
  const { id, jobId } = req.params;

  try {
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
  const { id, eventId } = req.params;

  try {
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
  const { id, jobId } = req.params;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id, 
      { $pull: {savedJobs: jobId} }, 
      { new: true }
    ).populate('savedJobs');

    req.session.currentUser = updatedUser;
    res.status(200).json(updatedUser);
  }
  catch (error) {
    next(error);
  }
})


// PUT	/user/:id/remove-event/:eventId	===> remove event from alumni dashboard
router.put('/:id/remove-event/:eventId', async(req, res, next) => {
  const { id, eventId } = req.params;

  try {
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