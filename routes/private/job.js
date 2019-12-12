const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const mongoose = require('mongoose');

const JobOffer = require('../../models/joboffer');
const User = require('../../models/user');


// GET	/job	===> Show all job offers 
router.get('/', async (req,res,next) => {
  try {
    const jobs = await JobOffer.find();
    // console.log(jobs);

    if(!jobs) {
      next(createError(404));
    } else {
      res.status(200).json(jobs);
    }
  } catch (error) {
    next(error);
  }
})


// GET	/job/:id	===> show specific job offer
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if ( !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Specified id is not valid'}); 
      return;
    }

    const job = await JobOffer.findById( id );
    res.status(200).json(job);
  } 
  catch (error) {
    next(error);
  }
})


// POST	/job/create	===> add job offer (admin only)
router.post('/create', (req, res, next) => {
  const { title, description, companyName, companyLogo, bootcamp, city, jobOfferUrl } = req.body;
  const userIsAdmin = req.session.currentUser.isAdmin
  
  // if required fields are empty
  if( !title || !description || !companyName || !bootcamp || !city || !jobOfferUrl) {
    return next(createError(400));
  } else {
    if(userIsAdmin) {
      // create the job offer
      JobOffer.create({ author: req.session.currentUser._id, title, description, companyName, companyLogo, bootcamp, city, jobOfferUrl })
      .then( (jobOfferCreated) => {
        const jobId = jobOfferCreated._id;
        // console.log(jobId);
        
        // update all admin users publishedOffers
        User.find({ isAdmin: true})
        .then( adminUsers =>{
          adminUsers.map( oneAdmin => {
            // console.log(oneAdmin._id);
            User.findByIdAndUpdate(oneAdmin._id,
              { $push: {publishedJobOffers: jobId} }, 
              { new: true })
            .then( (oneAdmin) => {
              //console.log(oneAdmin)
            })
            .catch( (err) => console.log(err));
          })
          // send back the answer with job offer
          res.status(201).json(jobOfferCreated);  
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


// PUT	/job/edit/:id	===>	edit job offer
router.put('/edit/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const userIsAdmin = req.session.currentUser.isAdmin;

    const { title, description, date, companyName, companyLogo, bootcamp, city, jobOfferUrl } = req.body;

    // check that the user editing the job offer is an admin
    if (!userIsAdmin) {
      res.status(401).json({ message: 'Unauthorized user'}); 
      return;
    }

    // add check : if fields are not empty
    await JobOffer.findByIdAndUpdate(
      id, 
      { title, description, date, companyName, companyLogo, bootcamp, city, jobOfferUrl }, 
      { new: true }
    );

    const updateJobOffer = await JobOffer.findById(id);
    // console.log('UPDATED JOB', updateJobOffer);
    res.status(200).json(updateJobOffer);
  } 
  catch (error) {
    next(error);
  }
})


// DELETE	/job/delete/:id	===>	delete specific job offer
router.get('/delete/:id', async (req, res, next) => {
  const jobId = req.params.id;

  try {
    await JobOffer.findByIdAndRemove(jobId);
    res.status(200).json({ message: 'Job offer deleted successfully'});
  }
  catch (error) {
    next(error);
  }
});


module.exports = router;
