const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const mongoose = require('mongoose');

const Event = require('../../models/event');
const User = require('../../models/user');


 // GET	/events	===>	show all events
router.get('/', async (req,res,next) => {
  try {
    const events = await Event.find();
    // console.log(jobs);

    if(!events) {
      next(createError(404));
    } else {
      res.status(200).json(events);
    }
  } catch (error) {
    next(error);
  }
})


  // GET	/events/:id ===> show specific event
  router.get('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
  
      if ( !mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: 'Specified id is not valid'}); 
        return;
      }
  
      const event = await Event.findById( id )
        .populate('author attendingAlumni');

      res.status(200).json(event);
    } 
    catch (error) {
      next(error);
    }
  })


  // POST	/event/create ===>	add event (admin only)
  router.post('/create', (req, res, next) => {
    const { title, description, date, image, bootcamp, streetAddress, city, eventUrl } = req.body;
    const userIsAdmin = req.session.currentUser.isAdmin;
  
    // if required fields are empty
    if( !title || !description || !date || !bootcamp || !streetAddress || !city || !eventUrl) {
      return next(createError(400));
    } else {
      if(userIsAdmin) {
        // create the job offer
        Event.create({ author: req.session.currentUser._id, title, description, date, image, bootcamp, streetAddress, city, eventUrl })
        .then( (eventCreated) => {
          const eventId = eventCreated._id;
          // console.log(eventId);
          
          // update all admin users publishedEvents
          User.find({ isAdmin: true})
          .then( adminUsers =>{
            adminUsers.map( oneAdmin => {
              // console.log(oneAdmin._id);
              User.findByIdAndUpdate(oneAdmin._id,
                { $push: {publishedEvents: eventId} }, 
                { new: true })
              .then( (oneAdmin) => { //console.log(oneAdmin)
              })
              .catch( (err) => console.log(err));
            })
            // send back the answer with event
            res.status(201).json(eventCreated);  
          })
          .catch( (err) => console.log(err));
        })
        .catch( (err) => console.log(err));
      } 
      else { // if user is not admin
        return next(createError(401));
      }
    }
  });


// PUT	/event/edit/:id	===>	edit event
router.put('/edit/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const userIsAdmin = req.session.currentUser.isAdmin;

    const { title, description, date, image, bootcamp, streetAddress, city, eventUrl } = req.body;

    // check that the user editing the event is an admin
    if (!userIsAdmin) {
      res.status(401).json({ message: 'Unauthorized user'}); 
      return;
    }

    // add check : if fields are not empty
    await Event.findByIdAndUpdate(
      id, 
      { title, description, date, image, bootcamp, streetAddress, city, eventUrl }, 
      { new: true }
    );

    const updatedEvent = await Event.findById(id);
    // console.log('UPDATED EVENT', updatedEvent);
    res.status(200).json(updatedEvent);
  } 
  catch (error) {
    next(error);
  }
})
  

// PUT	/events/delete/:id	===> delete specific event
router.get('/delete/:id', async (req, res, next) => {
  const eventId = req.params.id;

  try {
    await Event.findByIdAndRemove(eventId)
    res.status(200).json({ message: 'Event deleted successfully'});
  }
  catch (error) {
    next(error);
  }
});


module.exports = router;
