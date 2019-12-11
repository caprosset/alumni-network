const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobOfferSchema = Schema({
  author: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  title: {type: String, required: true},
  description: {type: String, required: true},
  companyName: {type: String, required: true},
  companyLogo: {type: String},
  bootcamp: {type: String, enum: [ "Web Development", "UX Design", "Data Analytics" ], required: true},
  city: {type: String, enum: [ "Madrid", "Barcelona", "Lisbon", "Amsterdam", "Paris", "Berlin", "Mexico City", "Sao Paulo", "Miami" ], required: true},
  jobOfferUrl: {type: String, required: true}
}, 
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
}); 

const JobOffer = mongoose.model('JobOffer', jobOfferSchema);

module.exports = JobOffer;