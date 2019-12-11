const createError = require('http-errors');

exports.isLoggedIn = (req, res, next) => {
  if (req.session.currentUser) next();
  else next(createError(401));
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) next();
  else next(createError(403));
};

exports.validationSignup = (req, res, next) => {
  const { firstName, lastName, email, password, bootcamp, campus, cohort, isAdmin } = req.body;

  if (!firstName || !lastName || !email || !password || !bootcamp || !campus || !cohort || !isAdmin) next(createError(400));
  else next();
};

exports.validationLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) next(createError(400));
  else next();
};
