const express = require('express');
const mongoose = require('mongoose');
const createError = require('http-errors');

const Event = require('../models/Event');
const User = require('../models/User');

class EventController {

  getAllEvents = async (req,res,next) => {
    try {
      const events = await Event.find();

      if(!events) {
        next(createError(404));
      } else {
        res.status(200).json(events);
      }
    } catch (error) {
      next(error);
    }
  }

  getOneEvent = async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ "message": "Specified id is not valid" });
        return;
      }

      const event = await Event.findById(id)
        .populate('author attendingAlumni');

      res.status(200).json(event);
    }
    catch (error) {
      next(error);
    }
  }

  addEvent = async (req, res, next) => {
    const { title, description, date, image, bootcamp, streetAddress, city, eventUrl } = req.body;
    const userIsAdmin = req.session.currentUser.isAdmin;

    // if required fields are empty
    if (!title || !description || !date || !bootcamp || !streetAddress || !city || !eventUrl) {
      next(createError(400));
    }

    if (!userIsAdmin) {
      res.status(401).json({ "message": "Bummer... Only admins can create events" });
      return;
    }

    // if all fields are complete and userIsAdmin, create the event
    try {
      const eventCreated = await Event.create({ author: req.session.currentUser._id, title, description, date, image, bootcamp, streetAddress, city, eventUrl });

      // update all admin users publishedEvents
      const adminUsers = await User.find({ isAdmin: true });
      adminUsers.map(async (oneAdmin) => {
        await User.findByIdAndUpdate(oneAdmin._id,
          { $push: { publishedEvents: eventCreated._id } },
          { new: true })
      })

      res.status(201).json(eventCreated);
    } catch (error) {
      next(createError(error))
    }
  }

  editEvent = async (req, res, next) => {
    try {
      const { id } = req.params;
      const userIsAdmin = req.session.currentUser.isAdmin;

      const { title, description, date, image, bootcamp, streetAddress, city, eventUrl } = req.body;

      // check that the user editing the event is an admin
      if (!userIsAdmin) {
        res.status(401).json({ "message": "Unauthorized user" });
        return;
      }

      // add check : if fields are not empty
      await Event.findByIdAndUpdate(
        id,
        { title, description, date, image, bootcamp, streetAddress, city, eventUrl },
        { new: true }
      );

      const updatedEvent = await Event.findById(id);
      res.status(200).json(updatedEvent);
    }
    catch (error) {
      next(error);
    }
  }

  deleteEvent = async (req, res, next) => {
    const eventId = req.params.id;

    try {
      await Event.findByIdAndRemove(eventId);

      await User.updateMany({},
        { $pull: { publishedEvents: eventId, savedEvents: eventId } },
        { new: true }
      );

      res.status(200).json({ "message": "Event deleted successfully" });
    }
    catch (error) {
      next(error);
    }
  }
}


const EventsController = new EventController();
module.exports = EventsController;