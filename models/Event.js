const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');

const eventSchema = new Schema({
  author: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  title: {type: String, required: true},
  description: {type: String, required: true},
  date: {type: Date, required: true},
  image: {type: String},
  bootcamp: {type: String, enum: [ "Web Development", "UX Design", "Data Analytics" ], required: true},
  streetAddress: {type: String, required: true},
  city: {type: String, enum: [ "Madrid", "Barcelona", "Lisbon", "Amsterdam", "Paris", "Berlin", "Mexico City", "Sao Paulo", "Miami" ], required: true},
  eventURL: {type: String, required: true}
});


const Event = mongoose.model('Event', eventSchema);

module.exports = Event;