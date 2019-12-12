const express = require('express');
const router = express.Router();

// ROUTER
const authRouter = require('./auth/auth');
const userRouter = require('./private/user');
// const jobsRouter = require('./private/jobs');
// const eventsRouter = require('./private/events');

// * '/auth' 
router.use('/auth', authRouter);


// PRE ROUTE MIDDLEWARE - check if user has authenticated cookie
router.use((req, res, next) => {
  if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
    next(); // ==> go to the next route ---
  } 																//		|
  else {                          	//    |
  	res.redirect('/login');       	//    |
  }                                 //    |
});																	//		|
	// 	 ------------------------------------
    // |
    // V

// * '/user'
router.use('/user', userRouter);

// // * '/jobs'
// router.use('/jobs', jobsRouter);

// // * '/events'
// router.use('/events', eventsRouter);



module.exports = router;