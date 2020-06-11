const createError = require('http-errors');

exports.isLoggedIn = (req, res, next) => {
  if (req.session.currentUser) next();
  else next(createError(401)); // Unauthorized
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) next();
  else next(createError(403)); // Forbidden
};

exports.validationSignup = (req, res, next) => {
  const { firstName, lastName, email, password, bootcamp, campus, cohort} = req.body;

  if (!firstName || !lastName || !email || !password || !bootcamp || !campus || !cohort) next(createError(400));
  else next();
};

exports.validationLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) next(createError(400));
  else next();
};
