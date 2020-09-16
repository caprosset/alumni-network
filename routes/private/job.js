const express = require('express');
const JobsController = require('../../controllers/jobsController')

const router = express.Router();

// GET	/job	===> Show all job offers 
router.get('/', JobsController.getAllJobs)


// GET	/job/:id	===> show specific job offer
router.get('/:id', JobsController.getOneJob)


// POST	/job/create	===> add job offer (admin only)
router.post('/create', JobsController.addJob)


// PUT	/job/edit/:id	===>	edit job offer
router.put('/edit/:id', JobsController.editJob)


// DELETE	/job/delete/:id	===>	delete specific job offer
router.get('/delete/:id', JobsController.deleteJob);


module.exports = router;
