const express = require('express');
const createError = require('http-errors');
const mongoose = require('mongoose');

const User = require('../models/User');
const Event = require('../models/Event');

class UserController {
  getAllUsers = async (req, res, next) => {
    try {
      // return only users that are not admin
      const users = await User.find({ isAdmin: false });
      res.status(200).json(users);
    } catch (error) {
      next(createError(error));
    }
  }

  getOneUser = async (req, res, next) => {
    const { id } = req.params;

    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ "message": "Specified id is not valid" });
        return;
      }

      const user = await User.findById(id)
        .populate('savedJobs savedEvents');

      res.status(200).json(user);
    }
    catch (error) {
      next(error);
    }
  }

  editUser = async (req, res, next) => {
    const { _id } = req.session.currentUser;
    const { firstName, lastName, phone, image, currentCity, currentRole, currentCompany, linkedinUrl, githubUrl, mediumUrl } = req.body;

    try {
      // check if the user being edited corresponds to the user logged in
      // if ( id !== req.session.currentUser._id ) {
      //   res.status(401).json({ "message": "Unauthorized id"}); 
      //   return;
      // }

      // Check that all required fields are completed
      if (!firstName || !lastName) {
        next(createError(400));
      } else {
        const updatedUser = await User.findByIdAndUpdate(
          _id,
          { firstName, lastName, phone, image, currentCity, currentRole, currentCompany, linkedinUrl, githubUrl, mediumUrl },
          { new: true }
        );

        console.log('Updated user in back =>>>>', updatedUser);

        req.session.currentUser = updatedUser;
        res.status(200).json(updatedUser);
      }
    }
    catch (error) {
      next(error);
    }
  }

  saveJob = async (req, res, next) => {
    const { id, jobId } = req.params;

    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $addToSet: { savedJobs: jobId } },
        { new: true }
      )

      req.session.currentUser = updatedUser;
      res.status(200).json(updatedUser);
    }
    catch (error) {
      next(error);
    }
  }

  saveEvent = async (req, res, next) => {
    const { id, eventId } = req.params;

    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $addToSet: { savedEvents: eventId } },
        { new: true }
      )

      await Event.findByIdAndUpdate(
        eventId,
        { $addToSet: { attendingAlumni: id } },
        { new: true }
      )

      req.session.currentUser = updatedUser;
      res.status(200).json(updatedUser);
    }
    catch (error) {
      next(error);
    }
  }

  removeJob = async (req, res, next) => {
    const { id, jobId } = req.params;

    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $pull: { savedJobs: jobId } },
        { new: true }
      ).populate('savedJobs');

      req.session.currentUser = updatedUser;
      res.status(200).json(updatedUser);
    }
    catch (error) {
      next(error);
    }
  }

  removeEvent = async (req, res, next) => {
    const { id, eventId } = req.params;

    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $pull: { savedEvents: eventId } },
        { new: true }
      ).populate('savedEvents');

      Event.findByIdAndUpdate(
        eventId,
        { $pull: { attendingAlumni: id } },
        { new: true }
      )

      req.session.currentUser = updatedUser;
      res.status(200).json(updatedUser);
    }
    catch (error) {
      next(error);
    }
  }
}

const UsersController = new UserController();
module.exports = UsersController;