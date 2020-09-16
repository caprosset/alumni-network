const express = require('express');
const UsersController = require('../../controllers/usersController');

const router = express.Router();


// GET	/user	===> Show all users 
router.get('/', UsersController.getAllUsers)


// GET	/user/:id ===> Show specific user
router.get('/:id', UsersController.getOneUser)


// PUT	/user/edit/:id	===> 
router.put('/edit', UsersController.editUser)


// PUT	/user/:id/save-job/:jobId	===> save job offer in alumni dashboard
router.put('/:id/save-job/:jobId', UsersController.saveJob)


// PUT	/user/:id/save-event/:eventId	===> save event in alumni dashboard
router.put('/:id/save-event/:eventId', UsersController.saveEvent)


// PUT	/user/:id/remove-job/:jobId	===> remove job offer from alumni dashboard
router.put('/:id/remove-job/:jobId', UsersController.removeJob)


// PUT	/user/:id/remove-event/:eventId	===> remove event from alumni dashboard
router.put('/:id/remove-event/:eventId', UsersController.removeEvent)

// DELETE	/user'/delete/:id' ===>	delete specific alumni (status codes:  201,400)
// alumni can't delete their profile for now

module.exports = router;