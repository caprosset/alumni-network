const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = Schema({
  author: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  title: {type: String, required: true},
  description: {type: String, required: true},
  date: {type: String, required: true},
  image: {type: String},
  bootcamp: {type: String, enum: [ "Web Development", "UX Design", "Data Analytics" ], required: true},
  streetAddress: {type: String, required: true},
  city: {type: String, enum: [ "Madrid", "Barcelona", "Lisbon", "Amsterdam", "Paris", "Berlin", "Mexico City", "Sao Paulo", "Miami" ], required: true},
  attendingAlumni: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  eventUrl: {type: String, required: true}
});


const Event = mongoose.model('Event', eventSchema);

module.exports = Event;