const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../../models/User');


// HELPER FUNCTIONS
const {
  isLoggedIn,
  isNotLoggedIn,
  validationSignup,
  validationLogin
} = require('../../helpers/middlewares');


//  GET '/auth/me'
router.get('/me', isLoggedIn, (req, res, next) => {
  //  ensure password is not sent to the client side
  req.session.currentUser.password = '*';

  // send the response with user info 
  res.json(req.session.currentUser);
});


//  POST '/auth/signup'
router.post(
  '/signup',
  isNotLoggedIn,
  validationSignup,
  async (req, res, next) => {
    const { firstName, lastName, email, password, bootcamp, campus, cohort, isAdmin } = req.body;

    try {
      // check if `email` already exists in the DB
      const emailExists = await User.findOne({ email }, 'email'); // return only the property 'email' of the user object (projection)

      if (emailExists) return next(createError(400));
      else {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashPass = bcrypt.hashSync(password, salt);

        const newUser = await User.create({ firstName, lastName, email, password: hashPass, bootcamp, campus, cohort, isAdmin, phone: '', profilePicture: '', currentCity: '', currentRole: '', currentCompany: '', linkedinUrl: '', githubUrl: '', mediumUrl: '' });
      
        // assign the newly created user to the session current user
        req.session.currentUser = newUser;
        res
          .status(200) //  OK
          .json(newUser);
      }
    } catch (error) {
      next(error);
    }
  },
);


//  POST '/auth/login'
router.post(
  '/login',
  isNotLoggedIn,
  validationLogin,
  async (req, res, next) => {
    const { email, password } = req.body;
    try {
      //check if user exists in the DB
      const user = await User.findOne({ email });

      // if user doesn't exist - forward the error to the error middleware using `next()`
      if (!user) {
        next(createError(404));
      } // if user exists and if password is the same as the one in the DB
      else if (bcrypt.compareSync(password, user.password)) {
        // assign the user document to `req.session.currentUser` 
        req.session.currentUser = user;
        // send json response
        res.status(200).json(user);
        return;
      } else {
        next(createError(401));
      }
    } catch (error) {
      next(error);
    }
  },
);


//  POST '/auth/logout'
router.post('/logout', isLoggedIn, (req, res, next) => {
  const { firstName, lastName } = req.session.currentUser;
  req.session.destroy();
  res
    .status(200) 
    .json({ message: `User '${firstName} ${lastName}' logged out - session destroyed` });
  return;
});


//  GET '/private'   --> Only for testing - Same as /me but it returns a message instead
// router.get('/private', isLoggedIn, (req, res, next) => {
//   res
//     .status(200) // OK
//     .json({ message: 'Test - User is logged in' });
// });


module.exports = router;
