const express = require('express');
const router = express.Router();

const EventsController = require('../../controllers/eventsController');

// GET	/events	===>	show all events
router.get('/', EventsController.getAllEvents)


// GET	/events/:id ===> show specific event
router.get('/:id', EventsController.getOneEvent)


// POST	/event/create ===>	add event (admin only)
router.post('/create', EventsController.addEvent);


// PUT	/event/edit/:id	===>	edit event
router.put('/edit/:id', EventsController.editEvent)


// PUT	/events/delete/:id	===> delete specific event
router.get('/delete/:id', EventsController.deleteEvent);


module.exports = router;
