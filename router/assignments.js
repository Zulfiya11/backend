const router = require('express').Router()
const assignmentsController = require('../controller/coursesController')



router.post('/create', assignmentsController.createAssignment)

router.get('/all', assignmentsController.getaAllAssignments)

// router.post('/edit/:id', coursesController.editCourse)

// router.post('/delete/:id', coursesController.deleteCourse)



module.exports = router




