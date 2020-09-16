const express = require('express');
const createError = require('http-errors');
const mongoose = require('mongoose');

const JobOffer = require('../models/JobOffer');
const User = require('../models/User');

class JobController {
  getAllJobs = async (req, res, next) => {
    try {
      const jobs = await JobOffer.find();

      if (!jobs) {
        next(createError(404));
      } else {
        res.status(200).json(jobs);
      }
    } catch (error) {
      next(createError(error));
    }
  }

  getOneJob = async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ "message": "Specified id is not valid" });
        return;
      }

      const job = await JobOffer.findById(id)
        .populate('author');

      res.status(200).json(job);
    }
    catch (error) {
      next(createError(error));
    }
  }

  addJob = async (req, res, next) => {
    const { title, description, companyName, image, bootcamp, city, jobOfferUrl } = req.body;
    const userIsAdmin = req.session.currentUser.isAdmin;

    if (!title || !description || !companyName || !bootcamp || !city || !jobOfferUrl) {
      next(createError(400));
    }

    if (!userIsAdmin) {
      res.status(401).json({ "message": "Bummer... Only admins can create job offers" });
      return;
    }

    // if all fields are complete and userIsAdmin, create the event
    try {
      const jobOfferCreated = await JobOffer.create({ author: req.session.currentUser._id, title, description, companyName, image, bootcamp, city, jobOfferUrl })

      // update all admin users publishedOffers
      const adminUsers = await User.find({ isAdmin: true });
      adminUsers.map(async (oneAdmin) => {
        await User.findByIdAndUpdate(oneAdmin._id,
          { $push: { publishedJobOffers: jobOfferCreated._id } },
          { new: true })
      })

      res.status(201).json(jobOfferCreated);
    } catch (error) {
      next(createError(error));
    }
  }

  editJob = async (req, res, next) => {
    try {
      const { id } = req.params;
      const userIsAdmin = req.session.currentUser.isAdmin;

      const { title, description, date, companyName, image, bootcamp, city, jobOfferUrl } = req.body;

      // check that the user editing the job offer is an admin
      if (!userIsAdmin) {
        res.status(401).json({ "message": "Unauthorized user" });
        return;
      }

      // add check : if fields are not empty
      const updateJobOffer = await JobOffer.findByIdAndUpdate(
        id,
        { title, description, date, companyName, image, bootcamp, city, jobOfferUrl },
        { new: true }
      );

      res.status(200).json(updateJobOffer);
    }
    catch (error) {
      next(createError(error));
    }
  }

  deleteJob = async (req, res, next) => {
    const jobId = req.params.id;

    try {
      await JobOffer.findByIdAndRemove(jobId);

      await User.updateMany({},
        { $pull: { publishedJobOffers: jobId, savedJobs: jobId } },
        { new: true }
      );

      res.status(200).json({ "message": "Job offer deleted successfully" });
    }
    catch (error) {
      next(error);
    }
  }
}

const JobsController = new JobController();
module.exports = JobsController;