const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  bootcamp: {type: String, enum: [ "Web Development", "UX Design", "Data Analytics" ], required: true},
  campus: {type: String, enum: [ "Madrid", "Barcelona", "Lisbon", "Amsterdam", "Paris", "Berlin", "Mexico City", "Sao Paulo", "Miami" ], required: true},
  cohort: {type: String, enum: [ "jan-18", "apr-18", "jul-18", "oct-18", "jan-19", "apr-19", "jul-19", "oct-19" ], required: true},
  phone: {type: String},
  profilePicture: {type: String},
  currentCity: {type: String},
  currentRole: {type: String},
  currentCompany: {type: String},
  linkedinUrl: {type: String},
  githubUrl: {type: String},
  mediumUrl: {type: String},
  savedEvents: [{  type: mongoose.Schema.Types.ObjectId, ref: "Event"}],
  savedJobs: [{  type: mongoose.Schema.Types.ObjectId, ref: "JobOffer"}],
  isAdmin: { type: Boolean, required: true, default: false },
  publishedEvents: [{  type: mongoose.Schema.Types.ObjectId, ref: "Event"}],
  publishedJobOffers: [{  type: mongoose.Schema.Types.ObjectId, ref: "JobOffer"}]
});

const User = mongoose.model('User', userSchema);

module.exports = User;